// Métricas ligeras de RomaHub.
// Solo envía el negocio, el tipo de acción y, cuando aplica, el elemento del
// catálogo. No guarda IP, WhatsApp, nombre de clienta ni otros datos personales.
window.RomaAnalytics = (function () {
  var EVENTOS = ['perfil_vista', 'producto_visto', 'whatsapp_click', 'reserva_click', 'compartir', 'favorito', 'promocion_vista', 'promocion_click'];
  var pendientes = new Set();

  function config() {
    var url = String(window.SUPABASE_URL || '').replace(/\/$/, '');
    var key = window.SUPABASE_ANON_KEY || '';
    return url && key ? { url: url, key: key } : null;
  }

  function claveDiaria(negocioId, evento, itemId) {
    var hoy = new Date();
    var dia = [hoy.getFullYear(), String(hoy.getMonth() + 1).padStart(2, '0'), String(hoy.getDate()).padStart(2, '0')].join('-');
    return ['romahub-metrica', dia, negocioId, evento, itemId || ''].join(':');
  }

  function yaRegistrado(clave) {
    try {
      return window.localStorage && window.localStorage.getItem(clave) === '1';
    } catch (error) {
      return false;
    }
  }

  function marcarRegistrado(clave) {
    try {
      window.localStorage && window.localStorage.setItem(clave, '1');
    } catch (error) {
      // La medición sigue funcionando si el navegador bloquea localStorage.
    }
  }

  async function track(datos, opciones) {
    try {
      opciones = opciones || {};
      var ajustes = config();
      var negocioId = String(datos && datos.negocioId || '').trim();
      var evento = String(datos && datos.evento || '').trim();
      if (!ajustes || !negocioId || EVENTOS.indexOf(evento) === -1) return false;

      var itemId = String(datos.itemId || '').slice(0, 120);
      var clave = opciones.oncePerDay ? claveDiaria(negocioId, evento, itemId) : '';
      if ((clave && yaRegistrado(clave)) || pendientes.has(clave || [negocioId, evento, itemId].join(':'))) return false;

      var pendingKey = clave || [negocioId, evento, itemId, Date.now(), Math.random()].join(':');
      pendientes.add(pendingKey);
      try {
        var response = await fetch(ajustes.url + '/functions/v1/registrar-evento-romahub', {
          method: 'POST',
          headers: {
            apikey: ajustes.key,
            Authorization: 'Bearer ' + ajustes.key,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            negocio_id: negocioId,
            evento: evento,
            item_tipo: String(datos.itemTipo || '').slice(0, 20),
            item_id: itemId,
            item_nombre: String(datos.itemNombre || '').slice(0, 160)
          }),
          keepalive: true
        });
        if (response.ok && clave) marcarRegistrado(clave);
        return response.ok;
      } finally {
        pendientes.delete(pendingKey);
      }
    } catch (error) {
      return false;
    }
  }

  return { track: track };
})();
