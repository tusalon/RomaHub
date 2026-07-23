// Animaciones de RomaHub: reveal al hacer scroll + contadores, mismo lenguaje
// de movimiento que la landing HouseofRservasRoma. Sin dependencias.
(function () {
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-target'), 10) || 0;
    if (reduced || !hasIO) {
      el.textContent = String(target);
      return;
    }
    var duration = 1200;
    var start = performance.now();
    function tick(now) {
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  var revealObserver = hasIO ? new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }) : null;

  var countObserver = hasIO ? new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        countObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 }) : null;

  function process() {
    var sections = document.querySelectorAll('main section:not([data-rr-reveal])');
    sections.forEach(function (el) {
      el.setAttribute('data-rr-reveal', '1');
      if (el.getAttribute('data-name') === 'home-hero') return; // el hero anima solo al cargar
      if (reduced || !hasIO) return;
      el.classList.add('reveal-rr');
      revealObserver.observe(el);
    });

    var counts = document.querySelectorAll('.countup-rr:not([data-rr-count])');
    counts.forEach(function (el) {
      el.setAttribute('data-rr-count', '1');
      if (reduced || !hasIO) {
        el.textContent = el.getAttribute('data-target') || el.textContent;
        return;
      }
      el.textContent = '0';
      countObserver.observe(el);
    });
  }

  // React pinta tarde y re-renderiza: capturar nodos nuevos según aparecen.
  // setTimeout y no requestAnimationFrame: rAF no dispara en pestañas en
  // segundo plano y dejaría secciones sin animar al volver.
  var scheduled = false;
  function scheduleProcess() {
    if (scheduled) return;
    scheduled = true;
    setTimeout(function () {
      scheduled = false;
      process();
    }, 40);
  }

  function start() {
    process();
    if ('MutationObserver' in window) {
      new MutationObserver(scheduleProcess).observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
