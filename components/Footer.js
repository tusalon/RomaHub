function Footer() {
  try {
    return (
      <footer className="border-t border-[var(--border)] bg-[#111827]" data-name="footer" data-file="components/Footer.js">
        <div className="container-rr py-10" data-name="footer-inner" data-file="components/Footer.js">
          <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between" data-name="footer-row" data-file="components/Footer.js">
            <div className="space-y-2" data-name="footer-brand" data-file="components/Footer.js">
              <div className="flex items-center gap-2.5" data-name="footer-brand-row" data-file="components/Footer.js">
                <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0" data-name="footer-mark" data-file="components/Footer.js">
                  <img src="icons/icon-96x96.png" alt="RomaHub" className="w-full h-full object-cover" width="32" height="32" data-name="footer-mark-img" data-file="components/Footer.js" />
                </div>
                <p className="text-sm font-bold text-white" data-name="footer-title" data-file="components/Footer.js">
                  Roma<span className="text-[#e83387]">Hub</span>
                </p>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed max-w-xs" data-name="footer-sub" data-file="components/Footer.js">
                El directorio de la belleza en Cuba. Valoraciones verificadas, productos y cursos. Parte del ecosistema Rservasroma.
              </p>
            </div>
            <div className="flex items-center gap-4" data-name="footer-links" data-file="components/Footer.js">
              <a className="text-xs text-gray-400 hover:text-[#e83387] transition-colors" href="search.html" data-name="footer-dir" data-file="components/Footer.js">
                Directorio
              </a>
              <a className="text-xs text-gray-400 hover:text-[#e83387] transition-colors" href="register.html" data-name="footer-register" data-file="components/Footer.js">
                Registrar negocio
              </a>
              <span className="text-xs text-gray-500" data-name="footer-copy" data-file="components/Footer.js">&copy; 2026 RomaHub</span>
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
