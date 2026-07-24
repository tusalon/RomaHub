// Edge Function: crear-tienda-externa
// Registro auto-servicio de tiendas externas de RomaHub (personas SIN cuenta
// de rservasroma). Corre con el SERVICE ROLE (omite RLS), así puede:
//   - crear el usuario en Supabase Auth (para que reuse el panel existente),
//   - crear la fila en `negocios` con es_tienda_externa=true,
//   - vincularlos en `usuarios_negocio`,
//   - guardar las credenciales recuperables en `tiendas_credenciales`
//     (tabla con RLS cerrada, solo accesible por el service role).
//
// El vendedor luego inicia sesión en login.html con su WhatsApp + la
// contraseña generada, y usa el MISMO BusinessPanelPage sin cambios.

const AUTH_PHONE_DOMAIN = "whatsapp.rservasroma.local";
const MAX_NOMBRE = 80;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function normalizarWhatsApp(value: string): string {
  const digits = String(value || "").replace(/\D/g, "");
  const local = digits.startsWith("53") && digits.length === 10 ? digits.slice(2) : digits;
  if (!/^\d{8}$/.test(local)) throw new Error("Escribe los 8 dígitos del WhatsApp cubano.");
  return local;
}

function quitarAcentos(t: string): string {
  const nfd = t.normalize("NFD");
  let out = "";
  for (const ch of nfd) {
    const c = ch.charCodeAt(0);
    if (c < 0x0300 || c > 0x036f) out += ch;
  }
  return out;
}

function slugBase(nombre: string): string {
  return quitarAcentos(String(nombre || "tienda").toLowerCase())
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "tienda";
}

function sufijoAleatorio(n: number): string {
  const chars = "abcdefghijkmnpqrstuvwxyz23456789"; // sin caracteres ambiguos
  const bytes = new Uint8Array(n);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

function generarPassword(): string {
  // 8 caracteres legibles, evitando ambigüedades (0/O, 1/l).
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Método no permitido." }, 405);

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
  const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  if (!SUPABASE_URL || !SERVICE_KEY) return json({ error: "Servidor sin configurar." }, 500);

  const svc = {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    "Content-Type": "application/json",
  };

  let body: Record<string, string> = {};
  try {
    body = await req.json();
  } catch {
    return json({ error: "Datos inválidos." }, 400);
  }

  // ── Validación ──
  let whatsapp: string;
  try {
    whatsapp = normalizarWhatsApp(body.whatsapp);
  } catch (e) {
    return json({ error: (e as Error).message }, 400);
  }
  const nombre = String(body.nombre || "").trim().slice(0, MAX_NOMBRE);
  if (nombre.length < 2) return json({ error: "Escribe el nombre de tu tienda." }, 400);

  const provincia = String(body.provincia || "").trim() || null;
  const municipio = String(body.municipio || "").trim() || null;
  const categoria = String(body.categoria || "").trim() || null;
  const descripcion = String(body.descripcion || "").trim().slice(0, 400) || null;
  const logo_url = String(body.logo_url || "").trim() || null;

  const authEmail = `53${whatsapp}@${AUTH_PHONE_DOMAIN}`;
  const password = generarPassword();

  // ── 1) Crear usuario en Supabase Auth (falla si el WhatsApp ya tiene cuenta) ──
  const authRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: "POST",
    headers: svc,
    body: JSON.stringify({ email: authEmail, password, email_confirm: true }),
  });
  const authData = await authRes.json().catch(() => ({}));
  if (!authRes.ok) {
    const msg = String(authData?.msg || authData?.error_description || authData?.error || "");
    if (/already|registered|exists/i.test(msg)) {
      return json({ error: "Ese WhatsApp ya tiene una tienda o cuenta. Inicia sesión." }, 409);
    }
    return json({ error: "No se pudo crear el acceso. Intenta de nuevo.", detalle: (msg || JSON.stringify(authData)).slice(0, 300), status: authRes.status }, 500);
  }
  const userId = authData?.id || authData?.user?.id;
  if (!userId) return json({ error: "No se pudo crear el acceso." }, 500);

  // Helper de limpieza si algo falla después de crear el usuario Auth.
  const rollbackAuth = async () => {
    await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${userId}`, { method: "DELETE", headers: svc }).catch(() => {});
  };

  // ── 2) slug único ──
  const base = slugBase(nombre);
  let slug = `${base}-${sufijoAleatorio(4)}`;
  for (let intento = 0; intento < 5; intento++) {
    const check = await fetch(
      `${SUPABASE_URL}/rest/v1/negocios?slug=eq.${encodeURIComponent(slug)}&select=id`,
      { headers: svc },
    );
    const rows = await check.json().catch(() => []);
    if (Array.isArray(rows) && rows.length === 0) break;
    slug = `${base}-${sufijoAleatorio(5)}`;
  }

  // ── 3) Crear negocio (tienda externa) ──
  const negocioId = crypto.randomUUID();
  const negocioRes = await fetch(`${SUPABASE_URL}/rest/v1/negocios`, {
    method: "POST",
    headers: { ...svc, Prefer: "return=representation" },
    body: JSON.stringify({
      id: negocioId,
      nombre,
      slug,
      email: `${slug}@romahub.local`,
      telefono: whatsapp,
      codigo_pais: "53",
      especialidad: categoria || "Tienda",
      provincia,
      municipio,
      mensaje_bienvenida: descripcion,
      logo_url,
      configurado: true,
      es_tienda_externa: true,
    }),
  });
  if (!negocioRes.ok) {
    await rollbackAuth();
    return json({ error: "No se pudo crear la tienda. Intenta de nuevo." }, 500);
  }

  // ── 4) Vincular usuario ↔ negocio ──
  const vinculoRes = await fetch(`${SUPABASE_URL}/rest/v1/usuarios_negocio`, {
    method: "POST",
    headers: svc,
    body: JSON.stringify({ user_id: userId, negocio_id: negocioId, rol: "dueno" }),
  });
  if (!vinculoRes.ok) {
    const detalle = await vinculoRes.text().catch(() => "");
    await rollbackAuth();
    await fetch(`${SUPABASE_URL}/rest/v1/negocios?id=eq.${negocioId}`, { method: "DELETE", headers: svc }).catch(() => {});
    return json({ error: "No se pudo enlazar el acceso. Intenta de nuevo.", detalle: detalle.slice(0, 300) }, 500);
  }

  // ── 5) Guardar credenciales recuperables (tabla RLS cerrada) ──
  await fetch(`${SUPABASE_URL}/rest/v1/tiendas_credenciales`, {
    method: "POST",
    headers: svc,
    body: JSON.stringify({
      negocio_id: negocioId,
      usuario: whatsapp,
      password_recuperacion: password,
      whatsapp,
    }),
  }).catch(() => {}); // si esto falla, la tienda ya existe; no bloquea el registro

  return json({
    ok: true,
    tienda: { nombre, slug, negocio_id: negocioId },
    acceso: { usuario: whatsapp, password },
  });
});
