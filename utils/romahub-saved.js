// Favoritos, vistos recientemente y última búsqueda de RomaHub.
// Todo se guarda en el navegador de la clienta; no requiere cuenta ni almacena
// nombre, WhatsApp u otros datos personales.
window.RomaSaved = (function () {
  var FAVORITES_KEY = 'romahub-favoritos-v1';
  var RECENTS_KEY = 'romahub-recientes-v1';
  var SEARCH_KEY = 'romahub-ultima-busqueda-v1';
  var CHANGE_EVENT = 'romahub:saved-change';
  var MAX_FAVORITES = 100;
  var MAX_RECENTS = 12;

  function read(key, fallback) {
    try {
      var value = JSON.parse(window.localStorage.getItem(key) || 'null');
      return value == null ? fallback : value;
    } catch (error) {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
      return true;
    } catch (error) {
      return false;
    }
  }

  function clean(value, max) {
    return String(value || '').trim().slice(0, max || 300);
  }

  function normalize(entry) {
    var type = ['negocio', 'producto', 'curso'].indexOf(entry && entry.type) >= 0 ? entry.type : 'negocio';
    var id = clean(entry && entry.id, 140);
    if (!id) return null;
    return {
      key: type + ':' + id,
      type: type,
      id: id,
      negocioId: clean(entry.negocioId || (type === 'negocio' ? id : ''), 140),
      nombre: clean(entry.nombre, 180) || 'Guardado de RomaHub',
      negocioNombre: clean(entry.negocioNombre, 180),
      subtitle: clean(entry.subtitle, 220),
      image: clean(entry.image, 800),
      logo: clean(entry.logo, 800),
      href: clean(entry.href, 800),
      precio: Number(entry.precio || 0),
      moneda: clean(entry.moneda, 8) || 'CUP',
      savedAt: Number(entry.savedAt || Date.now())
    };
  }

  function businessEntry(business) {
    var b = business || {};
    return normalize({
      type: 'negocio',
      id: b.id,
      negocioId: b.id,
      nombre: b.nombre,
      subtitle: [b.categoria, b.ubicacionCorta || b.ubicacion?.municipio, b.ubicacion?.provincia].filter(Boolean).join(' · '),
      image: b.portadaUrl,
      logo: b.logoUrl,
      href: 'business.html?id=' + encodeURIComponent(b.id || '')
    });
  }

  function showcaseEntry(item) {
    var it = item || {};
    var type = it.tipo === 'curso' ? 'curso' : 'producto';
    var id = String(it.itemId || it.id || '').replace(/^(producto|curso)-/, '');
    return normalize({
      type: type,
      id: id,
      negocioId: it.negocioId,
      nombre: it.nombre,
      negocioNombre: it.negocioNombre,
      subtitle: it.categoria,
      image: it.imagen,
      logo: it.negocioLogo,
      href: 'business.html?id=' + encodeURIComponent(it.negocioId || '') + '&item=' + encodeURIComponent(id) + '&tipo=' + encodeURIComponent(type),
      precio: it.precio,
      moneda: it.moneda
    });
  }

  function catalogEntry(item, type, business) {
    var it = item || {};
    var b = business || {};
    var normalizedType = type === 'curso' ? 'curso' : 'producto';
    return normalize({
      type: normalizedType,
      id: it.id,
      negocioId: b.id,
      nombre: it.nombre,
      negocioNombre: b.nombre,
      subtitle: it.categoria || (normalizedType === 'curso' ? 'Curso' : 'Producto'),
      image: it.imagen,
      logo: b.logoUrl,
      href: 'business.html?id=' + encodeURIComponent(b.id || '') + '&item=' + encodeURIComponent(it.id || '') + '&tipo=' + encodeURIComponent(normalizedType),
      precio: it.precio,
      moneda: it.moneda
    });
  }

  function listFavorites() {
    var rows = read(FAVORITES_KEY, []);
    return Array.isArray(rows) ? rows.map(normalize).filter(Boolean).sort(function (a, b) { return b.savedAt - a.savedAt; }) : [];
  }

  function isFavorite(entry) {
    var item = normalize(entry);
    return item ? listFavorites().some(function (saved) { return saved.key === item.key; }) : false;
  }

  function toggle(entry) {
    var item = normalize(entry);
    if (!item) return false;
    var rows = listFavorites();
    var exists = rows.some(function (saved) { return saved.key === item.key; });
    var next = exists
      ? rows.filter(function (saved) { return saved.key !== item.key; })
      : [{ ...item, savedAt: Date.now() }].concat(rows).slice(0, MAX_FAVORITES);
    write(FAVORITES_KEY, next);
    return !exists;
  }

  function addRecentBusiness(business) {
    var item = businessEntry(business);
    if (!item) return;
    var rows = listRecent().filter(function (saved) { return saved.key !== item.key; });
    write(RECENTS_KEY, [{ ...item, savedAt: Date.now() }].concat(rows).slice(0, MAX_RECENTS));
  }

  function listRecent() {
    var rows = read(RECENTS_KEY, []);
    return Array.isArray(rows) ? rows.map(normalize).filter(Boolean).sort(function (a, b) { return b.savedAt - a.savedAt; }) : [];
  }

  function clearRecent() {
    write(RECENTS_KEY, []);
  }

  function saveSearch(query) {
    var q = query || {};
    write(SEARCH_KEY, {
      nombre: clean(q.nombre, 100),
      servicio: clean(q.servicio, 100),
      ubicacion: clean(q.ubicacion, 100),
      ofertas: q.ofertas === true
    });
  }

  function getSearch() {
    var q = read(SEARCH_KEY, {});
    return {
      nombre: clean(q.nombre, 100),
      servicio: clean(q.servicio, 100),
      ubicacion: clean(q.ubicacion, 100),
      ofertas: q.ofertas === true
    };
  }

  function count() {
    return listFavorites().length;
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
    businessEntry: businessEntry,
    showcaseEntry: showcaseEntry,
    catalogEntry: catalogEntry,
    listFavorites: listFavorites,
    listRecent: listRecent,
    isFavorite: isFavorite,
    toggle: toggle,
    addRecentBusiness: addRecentBusiness,
    clearRecent: clearRecent,
    saveSearch: saveSearch,
    getSearch: getSearch,
    count: count,
    subscribe: subscribe
  };
})();
