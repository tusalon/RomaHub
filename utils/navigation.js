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
      const servicio = (url.searchParams.get('servicio') || '').trim();
      const ubicacion = (url.searchParams.get('ubicacion') || '').trim();
      return { servicio, ubicacion };
    } catch (error) {
      console.error('Navigation.getSearchParams error:', error);
      return { servicio: '', ubicacion: '' };
    }
  }

  function goToSearch(servicio, ubicacion) {
    try {
      const s = (servicio || '').trim();
      const u = (ubicacion || '').trim();
      const params = new URLSearchParams();
      if (s) params.set('servicio', s);
      if (u) params.set('ubicacion', u);
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

  return { getCurrentPage, getSearchParams, goToSearch, goHome, goToBusiness };
})();