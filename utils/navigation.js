const Navigation = (() => {
  function getCurrentPage() {
    try {
      const path = window.location.pathname || '';
      const file = path.split('/').pop() || 'index.html';
      return file === '' ? 'index.html' : file;
    } catch (error) {
      console.error('Navigation.getCurrentPage error:', error);
      return 'index.html';
    }
  }

  function getSearchParams() {
    try {
      const url = new URL(window.location.href);
      const nombre = (url.searchParams.get('nombre') || '').trim();
      const servicio = (url.searchParams.get('servicio') || '').trim();
      const ubicacion = (url.searchParams.get('ubicacion') || '').trim();
      const ofertas = url.searchParams.get('ofertas') === '1';
      return { nombre, servicio, ubicacion, ofertas };
    } catch (error) {
      console.error('Navigation.getSearchParams error:', error);
      return { nombre: '', servicio: '', ubicacion: '', ofertas: false };
    }
  }

  function goToSearch(servicio, ubicacion, nombre, ofertas = false) {
    try {
      const s = (servicio || '').trim();
      const u = (ubicacion || '').trim();
      const n = (nombre || '').trim();
      const params = new URLSearchParams();
      if (n) params.set('nombre', n);
      if (s) params.set('servicio', s);
      if (u) params.set('ubicacion', u);
      if (ofertas) params.set('ofertas', '1');
      window.RomaSaved?.saveSearch?.({ nombre: n, servicio: s, ubicacion: u, ofertas: Boolean(ofertas) });
      window.location.href = `search.html?${params.toString()}`;
    } catch (error) {
      console.error('Navigation.goToSearch error:', error);
    }
  }

  function goHome(sectionId) {
    try {
      if (!sectionId) {
        window.location.href = 'index.html';
        return;
      }
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = `index.html#${sectionId}`;
      }
    } catch (error) {
      console.error('Navigation.goHome error:', error);
    }
  }

  function goToBusiness(businessId) {
    try {
      const id = encodeURIComponent(businessId);
      window.location.href = `business.html?id=${id}`;
    } catch (error) {
      console.error('Navigation.goToBusiness error:', error);
    }
  }

  function goToRegister() {
    try {
      window.location.href = 'crear-tienda.html';
    } catch (error) {
      console.error('Navigation.goToRegister error:', error);
    }
  }

  return { getCurrentPage, getSearchParams, goToSearch, goHome, goToBusiness, goToRegister };
})();
