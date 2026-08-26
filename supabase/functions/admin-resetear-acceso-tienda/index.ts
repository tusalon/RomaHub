// Edge Function: admin-resetear-acceso-tienda
// Genera un usuario/contraseña nuevos para una tienda RomaHub cuando su
// dueña perdió la contraseña Y el código de recuperación (ambos se
// muestran una sola vez, RomaHub nunca los guarda legibles). Solo la
// llama el SuperAdmin, autenticado con su propia sesión de Supabase Auth.

import {
  corsHeaders,
  generateRecoveryCode,
  hashRecoveryCode,
  isOriginAllowed,
  json,
} from "../_shared/romahub-security.ts";

const ADMIN_EMAIL = "rservasroma@gmail.com";

function randomChars(length: number, chars: string): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => chars[byte % chars.length]).join("");
}

function generarPassword(): string {
  return randomChars(12, "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789");
}

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

  // Solo el SuperAdmin: exige el JWT de su propia sesion (la misma que ya
  // usa para entrar al panel) y verifica que sea la cuenta admin, no el
  // secreto de servicio ni la clave anonima publica.
  const authHeader = req.headers.get("authorization") || "";
  const callerToken = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!callerToken || callerToken === SERVICE_KEY) {
    return json(req, { error: "Inicia sesión como administrador." }, 401);
  }
  const callerResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${callerToken}` },
  });
  const caller = await callerResponse.json().catch(() => ({}));
  if (!callerResponse.ok || caller?.email !== ADMIN_EMAIL) {
    return json(req, { error: "No autorizado." }, 403);
  }

  let body: Record<string, string> = {};
  try {
    body = await req.json();
  } catch {
    return json(req, { error: "Datos inválidos." }, 400);
  }
  const negocioId = String(body.negocio_id || "").trim();
  if (!negocioId) return json(req, { error: "Falta el negocio." }, 400);

  const negocioResponse = await fetch(
    `${SUPABASE_URL}/rest/v1/negocios?id=eq.${encodeURIComponent(negocioId)}&es_tienda_externa=eq.true&select=id,nombre`,
    { headers: serviceHeaders },
  );
  const negocioRows = await negocioResponse.json().catch(() => []);
  if (!Array.isArray(negocioRows) || !negocioRows[0]) {
    return json(req, { error: "Esa tienda no existe o no es una tienda externa de RomaHub." }, 404);
  }

  const credentialsResponse = await fetch(
    `${SUPABASE_URL}/rest/v1/tiendas_credenciales?negocio_id=eq.${encodeURIComponent(negocioId)}&select=user_id,usuario&limit=1`,
    { headers: serviceHeaders },
  );
  const credentialsRows = await credentialsResponse.json().catch(() => []);
  const credentials = Array.isArray(credentialsRows) ? credentialsRows[0] : null;
  if (!credentials?.user_id) {
    return json(req, { error: "Esta tienda no tiene un acceso registrado." }, 404);
  }

  const newPassword = generarPassword();
  const updateAuthResponse = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${credentials.user_id}`, {
    method: "PUT",
    headers: serviceHeaders,
    body: JSON.stringify({ password: newPassword }),
  });
  if (!updateAuthResponse.ok) {
    return json(req, { error: "No se pudo restablecer la contraseña." }, 500);
  }

  const recoveryCode = generateRecoveryCode();
  const recoveryHash = await hashRecoveryCode(recoveryCode, SERVICE_KEY);
  await fetch(`${SUPABASE_URL}/rest/v1/tiendas_credenciales?negocio_id=eq.${encodeURIComponent(negocioId)}`, {
    method: "PATCH",
    headers: serviceHeaders,
    body: JSON.stringify({
      password_recuperacion: null,
      codigo_recuperacion_hash: recoveryHash,
      codigo_actualizado_at: new Date().toISOString(),
      intentos_fallidos: 0,
      bloqueado_hasta: null,
      updated_at: new Date().toISOString(),
    }),
  }).catch(() => {});

  return json(req, {
    ok: true,
    acceso: {
      usuario: credentials.usuario,
      password: newPassword,
      codigo_recuperacion: recoveryCode,
    },
  });
});
