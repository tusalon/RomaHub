// Edge Function: registrar-evento-romahub
// Guarda métricas de conversión sin almacenar datos personales del visitante.

import {
  corsHeaders,
  enforceRateLimits,
  isOriginAllowed,
  json,
} from "../_shared/romahub-security.ts";

const EVENTOS = new Set([
  "perfil_vista",
  "producto_visto",
  "whatsapp_click",
  "reserva_click",
  "compartir",
]);

const TIPOS = new Set(["producto", "curso", "servicio"]);
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(req) });
  if (req.method !== "POST") return json(req, { error: "Método no permitido." }, 405);
  if (!isOriginAllowed(req)) return json(req, { error: "Origen no permitido." }, 403);

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
  const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  if (!SUPABASE_URL || !SERVICE_KEY) return json(req, { error: "Servidor sin configurar." }, 500);

  let body: Record<string, string> = {};
  try {
    body = await req.json();
  } catch {
    return json(req, { error: "Datos inválidos." }, 400);
  }

  const negocioId = String(body.negocio_id || "").trim();
  const evento = String(body.evento || "").trim();
  const itemTipo = String(body.item_tipo || "").trim();
  const itemId = String(body.item_id || "").trim().slice(0, 120);
  const itemNombre = String(body.item_nombre || "").trim().slice(0, 160);

  if (!UUID_RE.test(negocioId) || !EVENTOS.has(evento)) {
    return json(req, { error: "Evento inválido." }, 400);
  }
  if (itemTipo && !TIPOS.has(itemTipo)) {
    return json(req, { error: "Tipo de elemento inválido." }, 400);
  }

  try {
    const allowed = await enforceRateLimits(
      req,
      SUPABASE_URL,
      SERVICE_KEY,
      `evento_${evento}`,
      negocioId,
      { ipLimit: 300, phoneLimit: 1000, windowSeconds: 3600 },
    );
    if (!allowed) return json(req, { ok: true, limited: true }, 202);
  } catch (error) {
    console.error("Rate limit estadísticas:", error);
    return json(req, { ok: true, skipped: true }, 202);
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/romahub_eventos`, {
    method: "POST",
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      negocio_id: negocioId,
      evento,
      item_tipo: itemTipo || null,
      item_id: itemId || null,
      item_nombre: itemNombre || null,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("No se pudo registrar evento:", response.status, detail);
    return json(req, { error: "No se pudo registrar el evento." }, 500);
  }

  return json(req, { ok: true }, 202);
});
