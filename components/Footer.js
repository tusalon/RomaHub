function Footer() {
  try {
    const year = 2026;
    return (
      <footer className="border-t border-[var(--border)] bg-white" data-name="footer" data-file="components/Footer.js">
        <div className="container-rr py-10" data-name="footer-inner" data-file="components/Footer.js">
          <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between" data-name="footer-row" data-file="components/Footer.js">
            <div className="space-y-2" data-name="footer-brand" data-file="components/Footer.js">
              <p className="text-sm font-semibold" data-name="footer-title" data-file="components/Footer.js">Rservas.Roma Marketplace</p>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed" data-name="footer-sub" data-file="components/Footer.js">
                Belleza y servicios en Cuba. Reserva por WhatsApp y descubre negocios VIP con reseñas verificadas.
              </p>
            </div>
            <div className="flex items-center gap-2" data-name="footer-legal" data-file="components/Footer.js">
              <span className="text-xs text-[var(--text-muted)]" data-name="footer-copy" data-file="components/Footer.js">© {year} Rservas.Roma</span>
              <span className="text-xs text-[var(--text-muted)]" data-name="footer-dot" data-file="components/Footer.js">•</span>
              <a className="text-xs text-[var(--text-muted)] hover:text-[var(--primary-color)] transition-colors" href="index.html#muro" data-name="footer-muro" data-file="components/Footer.js">
                Muro de la Intriga
              </a>
            </div>
          </div>
        </div>
      </footer>
    );
  } catch (error) {
    console.error('Footer component error:', error);
    return null;
  }
}