// Edge Function: crear-tienda-externa
// Registro autoservicio protegido para negocios sin cuenta de Rservasroma.

import {
  corsHeaders,
  enforceRateLimits,
  generateRecoveryCode,
  hashRecoveryCode,
  isOriginAllowed,
  json,
  normalizeWhatsApp,
} from "../_shared/romahub-security.ts";

const AUTH_PHONE_DOMAIN = "whatsapp.rservasroma.local";
const MAX_NOMBRE = 80;

function quitarAcentos(texto: string): string {
  const normalizado = texto.normalize("NFD");
  let limpio = "";
  for (const caracter of normalizado) {
    const codigo = caracter.charCodeAt(0);
    if (codigo < 0x0300 || codigo > 0x036f) limpio += caracter;
  }
  return limpio;
}

function slugBase(nombre: string): string {
  return quitarAcentos(String(nombre || "tienda").toLowerCase())
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "tienda";
}

function randomChars(length: number, chars: string): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => chars[byte % chars.length]).join("");
}

function generarPassword(): string {
  return randomChars(12, "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789");
}

function sufijoAleatorio(length: number): string {
  return randomChars(length, "abcdefghijkmnpqrstuvwxyz23456789");
}

function safeHttpsUrl(value: string): string | null {
  const raw = String(value || "").trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    return url.protocol === "https:" ? url.toString().slice(0, 1000) : null;
  } catch {
    return null;
  }
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

  let body: Record<string, string> = {};
  try {
    body = await req.json();
  } catch {
    return json(req, { error: "Datos inválidos." }, 400);
  }

  // Campo invisible para frenar robots de formularios sin afectar personas.
  if (String(body.website || "").trim()) {
    return json(req, { error: "No se pudo validar el formulario." }, 400);
  }

  let whatsapp: string;
  try {
    whatsapp = normalizeWhatsApp(body.whatsapp);
  } catch (error) {
    return json(req, { error: (error as Error).message }, 400);
  }

  try {
    const allowed = await enforceRateLimits(req, SUPABASE_URL, SERVICE_KEY, "registro_tienda", whatsapp, {
      ipLimit: 5,
      phoneLimit: 3,
      windowSeconds: 3600,
    });
    if (!allowed) return json(req, { error: "Demasiados intentos. Espera una hora antes de probar otra vez." }, 429);
  } catch (error) {
    console.error("Rate limit registro:", error);
    return json(req, { error: "El registro está temporalmente protegido. Intenta más tarde." }, 503);
  }

  const nombre = String(body.nombre || "").trim().slice(0, MAX_NOMBRE);
  if (nombre.length < 2) return json(req, { error: "Escribe el nombre de tu negocio." }, 400);

  const provincia = String(body.provincia || "").trim().slice(0, 80) || null;
  if (!provincia) return json(req, { error: "Selecciona la provincia de tu negocio." }, 400);
  const municipio = String(body.municipio || "").trim().slice(0, 100) || null;
  const categoria = String(body.categoria || "").trim().slice(0, 80) || null;
  const descripcion = String(body.descripcion || "").trim().slice(0, 600) || null;
  const logoUrl = safeHttpsUrl(body.logo_url);

  const authEmail = `53${whatsapp}@${AUTH_PHONE_DOMAIN}`;
  const password = generarPassword();
  const recoveryCode = generateRecoveryCode();
  const recoveryHash = await hashRecoveryCode(recoveryCode, SERVICE_KEY);

  const authResponse = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: "POST",
    headers: serviceHeaders,
    body: JSON.stringify({ email: authEmail, password, email_confirm: true }),
  });
  const authData = await authResponse.json().catch(() => ({}));
  if (!authResponse.ok) {
    const detail = String(authData?.msg || authData?.error_description || authData?.error || "");
    if (/already|registered|exists/i.test(detail)) {
      return json(req, { error: "Ese WhatsApp ya tiene una tienda o cuenta. Inicia sesión." }, 409);
    }
    return json(req, { error: "No se pudo crear el acceso. Intenta de nuevo." }, 500);
  }

  const userId = authData?.id || authData?.user?.id;
  if (!userId) return json(req, { error: "No se pudo crear el acceso." }, 500);

  const rollbackAuth = async () => {
    await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${userId}`, {
      method: "DELETE",
      headers: serviceHeaders,
    }).catch(() => {});
  };

  const base = slugBase(nombre);
  let slug = `${base}-${sufijoAleatorio(4)}`;
  for (let attempt = 0; attempt < 5; attempt++) {
    const check = await fetch(
      `${SUPABASE_URL}/rest/v1/negocios?slug=eq.${encodeURIComponent(slug)}&select=id`,
      { headers: serviceHeaders },
    );
    const rows = await check.json().catch(() => []);
    if (Array.isArray(rows) && rows.length === 0) break;
    slug = `${base}-${sufijoAleatorio(5)}`;
  }

  const negocioId = crypto.randomUUID();
  const businessResponse = await fetch(`${SUPABASE_URL}/rest/v1/negocios`, {
    method: "POST",
    headers: { ...serviceHeaders, Prefer: "return=representation" },
    body: JSON.stringify({
      id: negocioId,
      nombre,
      slug,
      email: `${slug}@romahub.local`,
      telefono: whatsapp,
      codigo_pais: "53",
      especialidad: categoria || "Belleza",
      provincia,
      municipio,
      mensaje_bienvenida: descripcion,
      logo_url: logoUrl,
      configurado: true,
      es_tienda_externa: true,
    }),
  });
  if (!businessResponse.ok) {
    await rollbackAuth();
    return json(req, { error: "No se pudo crear el negocio. Intenta de nuevo." }, 500);
  }

  const linkResponse = await fetch(`${SUPABASE_URL}/rest/v1/usuarios_negocio`, {
    method: "POST",
    headers: serviceHeaders,
    body: JSON.stringify({ user_id: userId, negocio_id: negocioId, rol: "dueno" }),
  });
  if (!linkResponse.ok) {
    await rollbackAuth();
    await fetch(`${SUPABASE_URL}/rest/v1/negocios?id=eq.${negocioId}`, {
      method: "DELETE",
      headers: serviceHeaders,
    }).catch(() => {});
    return json(req, { error: "No se pudo enlazar el acceso. Intenta de nuevo." }, 500);
  }

  const credentialsResponse = await fetch(`${SUPABASE_URL}/rest/v1/tiendas_credenciales`, {
    method: "POST",
    headers: serviceHeaders,
    body: JSON.stringify({
      negocio_id: negocioId,
      user_id: userId,
      usuario: whatsapp,
      password_recuperacion: null,
      whatsapp,
      codigo_recuperacion_hash: recoveryHash,
      codigo_actualizado_at: new Date().toISOString(),
      intentos_fallidos: 0,
      bloqueado_hasta: null,
      updated_at: new Date().toISOString(),
    }),
  });

  if (!credentialsResponse.ok) {
    await rollbackAuth();
    await fetch(`${SUPABASE_URL}/rest/v1/negocios?id=eq.${negocioId}`, {
      method: "DELETE",
      headers: serviceHeaders,
    }).catch(() => {});
    return json(req, { error: "No se pudo preparar la recuperación segura. Intenta de nuevo." }, 500);
  }

  return json(req, {
    ok: true,
    tienda: { nombre, slug, negocio_id: negocioId },
    acceso: {
      usuario: whatsapp,
      password,
      codigo_recuperacion: recoveryCode,
    },
  });
});
