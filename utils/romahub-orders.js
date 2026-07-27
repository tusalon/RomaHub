// Seguimiento de pedidos sin cuenta. Solo se guardan tokens aleatorios en el
// dispositivo; el nombre y el WhatsApp de la compradora permanecen en Supabase.
window.RomaOrders = (function () {
  var STORAGE_KEY = 'romahub-pedidos-v1';
  var CHANGE_EVENT = 'romahub:orders-change';
  var MAX_ORDERS = 20;
  var UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  function config() {
    var url = window.SUPABASE_URL || window.supabaseUrl || '';
    var key = window.SUPABASE_ANON_KEY || window.supabaseAnonKey || '';
    if (!url || !key) throw new Error('Supabase no configurado');
    return { url: String(url).replace(/\/$/, ''), key: key };
  }

  function read() {
    try {
      var rows = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
      if (!Array.isArray(rows)) return [];
      return rows.filter(function (row) {
        return row && UUID_PATTERN.test(String(row.token || ''));
      }).slice(0, MAX_ORDERS);
    } catch (error) {
      return [];
    }
  }

  function write(rows) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rows.slice(0, MAX_ORDERS)));
      window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
      return true;
    } catch (error) {
      return false;
    }
  }

  async function rpc(name, payload) {
    var current = config();
    var response = await fetch(current.url + '/rest/v1/rpc/' + name, {
      method: 'POST',
      headers: {
        apikey: current.key,
        Authorization: 'Bearer ' + current.key,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      cache: 'no-store',
      body: JSON.stringify(payload || {})
    });

    if (!response.ok) {
      var detail = await response.text();
      throw new Error('No se pudo completar la solicitud (' + response.status + '). ' + detail);
    }
    return response.json();
  }

  function save(order) {
    var token = String(order && order.tracking_token || '');
    if (!UUID_PATTERN.test(token)) return false;
    var rows = read().filter(function (row) { return row.token !== token; });
    rows.unshift({
      token: token,
      orderId: String(order.id || ''),
      savedAt: Date.now()
    });
    return write(rows);
  }

  async function createOrder(negocioId, order) {
    var created = await rpc('crear_pedido_romahub', {
      p_negocio_id: negocioId,
      p_cliente_nombre: order.cliente_nombre,
      p_cliente_whatsapp: order.cliente_whatsapp,
      p_items: order.items || [],
      p_total: Number(order.total || 0)
    });
    save(created || {});
    return created;
  }

  async function list() {
    var rows = read();
    if (!rows.length) return [];
    var result = await rpc('consultar_mis_pedidos_romahub', {
      p_tokens: rows.map(function (row) { return row.token; })
    });
    return Array.isArray(result) ? result : [];
  }

  function clear() {
    return write([]);
  }

  function count() {
    return read().length;
  }

  function subscribe(callback) {
    var handler = function () { callback(); };
    window.addEventListener(CHANGE_EVENT, handler);
    window.addEventListener('storage', handler);
    return function () {
      window.removeEventListener(CHANGE_EVENT, handler);
      window.removeEventListener('storage', handler);
    };
  }

  return {
    createOrder: createOrder,
    list: list,
    clear: clear,
    count: count,
    subscribe: subscribe
  };
})();
