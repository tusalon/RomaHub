// Edge Function: recuperar-acceso
// Cambia la contraseña usando el código secreto entregado al crear la tienda.

import {
  corsHeaders,
  enforceRateLimits,
  generateRecoveryCode,
  hashRecoveryCode,
  isOriginAllowed,
  json,
  normalizeRecoveryCode,
  normalizeWhatsApp,
  sameHash,
} from "../_shared/romahub-security.ts";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(req) });
  if (req.method !== "POST") return json(req, { error: "Método no permitido." }, 405);
  if (!isOriginAllowed(req)) return json(req, { error: "Origen no permitido." }, 403);

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
  const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  if (!SUPABASE_URL || !SERVICE_KEY) return json(req, { error: "Servidor sin configurar." }, 500);

  const serviceHeaders = {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    "Content-Type": "application/json",
  };

  let body: Record<string, string> = {};
  try {
    body = await req.json();
  } catch {
    return json(req, { error: "Datos inválidos." }, 400);
  }

  if (String(body.website || "").trim()) return json(req, { error: "No se pudo validar el formulario." }, 400);

  let whatsapp: string;
  try {
    whatsapp = normalizeWhatsApp(body.whatsapp);
  } catch (error) {
    return json(req, { error: (error as Error).message }, 400);
  }

  const recoveryCode = normalizeRecoveryCode(body.codigo_recuperacion);
  const newPassword = String(body.nueva_password || "");
  if (recoveryCode.length !== 16) return json(req, { error: "Escribe el código de recuperación completo." }, 400);
  if (newPassword.length < 10 || newPassword.length > 72 || !/[A-Za-z]/.test(newPassword) || !/\d/.test(newPassword)) {
    return json(req, { error: "La nueva contraseña debe tener al menos 10 caracteres, letras y números." }, 400);
  }

  try {
    const allowed = await enforceRateLimits(req, SUPABASE_URL, SERVICE_KEY, "recuperar_acceso", whatsapp, {
      ipLimit: 10,
      phoneLimit: 5,
      windowSeconds: 3600,
    });
    if (!allowed) return json(req, { error: "Demasiados intentos. Espera una hora antes de probar otra vez." }, 429);
  } catch (error) {
    console.error("Rate limit recuperación:", error);
    return json(req, { error: "La recuperación está temporalmente protegida. Intenta más tarde." }, 503);
  }

  const credentialsResponse = await fetch(
    `${SUPABASE_URL}/rest/v1/tiendas_credenciales?whatsapp=eq.${encodeURIComponent(whatsapp)}&select=negocio_id,user_id,codigo_recuperacion_hash,intentos_fallidos,bloqueado_hasta&limit=1`,
    { headers: serviceHeaders },
  );
  const credentialsRows = await credentialsResponse.json().catch(() => []);
  const credentials = Array.isArray(credentialsRows) ? credentialsRows[0] : null;

  if (!credentials?.user_id || !credentials?.codigo_recuperacion_hash) {
    return json(req, { error: "Este acceso necesita verificación manual. Contacta al equipo de RomaHub." }, 409);
  }

  if (credentials.bloqueado_hasta && new Date(credentials.bloqueado_hasta).getTime() > Date.now()) {
    return json(req, { error: "Este código está bloqueado temporalmente por seguridad." }, 429);
  }

  const candidateHash = await hashRecoveryCode(recoveryCode, SERVICE_KEY);
  if (!sameHash(candidateHash, credentials.codigo_recuperacion_hash)) {
    const attempts = Number(credentials.intentos_fallidos || 0) + 1;
    const blockedUntil = attempts >= 5 ? new Date(Date.now() + 30 * 60 * 1000).toISOString() : null;
    await fetch(`${SUPABASE_URL}/rest/v1/tiendas_credenciales?negocio_id=eq.${credentials.negocio_id}`, {
      method: "PATCH",
      headers: serviceHeaders,
      body: JSON.stringify({
        intentos_fallidos: attempts >= 5 ? 0 : attempts,
        bloqueado_hasta: blockedUntil,
        updated_at: new Date().toISOString(),
      }),
    }).catch(() => {});
    return json(req, { error: "WhatsApp o código de recuperación incorrectos." }, 401);
  }

  const updateAuthResponse = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${credentials.user_id}`, {
    method: "PUT",
    headers: serviceHeaders,
    body: JSON.stringify({ password: newPassword }),
  });
  if (!updateAuthResponse.ok) {
    return json(req, { error: "No se pudo cambiar la contraseña. Intenta de nuevo." }, 500);
  }

  const nextRecoveryCode = generateRecoveryCode();
  const nextRecoveryHash = await hashRecoveryCode(nextRecoveryCode, SERVICE_KEY);
  const saveResponse = await fetch(`${SUPABASE_URL}/rest/v1/tiendas_credenciales?negocio_id=eq.${credentials.negocio_id}`, {
    method: "PATCH",
    headers: serviceHeaders,
    body: JSON.stringify({
      password_recuperacion: null,
      codigo_recuperacion_hash: nextRecoveryHash,
      codigo_actualizado_at: new Date().toISOString(),
      intentos_fallidos: 0,
      bloqueado_hasta: null,
      updated_at: new Date().toISOString(),
    }),
  });
  if (!saveResponse.ok) return json(req, { error: "La contraseña cambió, pero no se pudo renovar el código. Contacta a RomaHub." }, 500);

  return json(req, {
    ok: true,
    codigo_recuperacion: nextRecoveryCode,
  });
});
