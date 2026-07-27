function Footer() {
  try {
    // Estructura en columnas al estilo de los directorios grandes (Fresha):
    // marca a la izquierda y grupos etiquetados por intencion. Solo se enlaza
    // a paginas que existen de verdad en el repo, nada de enlaces muertos.
    const columnas = [
      {
        titulo: 'Explorar',
        enlaces: [
          { texto: 'Inicio', href: 'index.html' },
          { texto: 'Reservas', href: 'search.html' },
          { texto: 'Tienda', href: 'tienda.html' }
        ]
      },
      {
        titulo: 'Para negocios',
        enlaces: [
          { texto: 'Abrir tienda gratis', href: 'register.html' },
          { texto: 'Acceso negocio', href: 'login.html' }
        ]
      },
      {
        titulo: 'Rservasroma',
        enlaces: [
          { texto: 'Conocer la app', href: 'https://tusalon.github.io/HouseofRservasRoma/', externo: true },
          { texto: 'Hablar por WhatsApp', href: 'https://wa.me/15154650340', externo: true }
        ]
      }
    ];

    return (
      <footer className="border-t border-[var(--border)] bg-[#111827]" data-name="footer" data-file="components/Footer.js">
        <div className="container-rr py-10 md:py-12" data-name="footer-inner" data-file="components/Footer.js">
          <div className="grid grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-8 md:gap-6" data-name="footer-grid" data-file="components/Footer.js">
            <div className="col-span-2 md:col-span-1 space-y-3" data-name="footer-brand" data-file="components/Footer.js">
              <div className="flex items-center gap-2.5" data-name="footer-brand-row" data-file="components/Footer.js">
                <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0" data-name="footer-mark" data-file="components/Footer.js">
                  <img loading="lazy" src="icons/icon-96x96.png" alt="RomaHub" className="w-full h-full object-cover" width="32" height="32" data-name="footer-mark-img" data-file="components/Footer.js" />
                </div>
                <p className="text-sm font-bold text-white" data-name="footer-title" data-file="components/Footer.js">
                  Roma<span className="text-[#e83387]">Hub</span>
                </p>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed max-w-xs" data-name="footer-sub" data-file="components/Footer.js">
                El directorio de la belleza en Cuba. Encuentra tu salon, reserva online y compra productos y cursos directo del negocio.
              </p>
              <p className="text-xs text-gray-500 leading-relaxed max-w-xs" data-name="footer-eco" data-file="components/Footer.js">
                Parte del ecosistema Rservasroma.
              </p>
            </div>

            {columnas.map((columna) => (
              <div key={columna.titulo} data-name="footer-col" data-file="components/Footer.js">
                <p className="text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-3" data-name="footer-col-title" data-file="components/Footer.js">
                  {columna.titulo}
                </p>
                <ul className="space-y-2.5" data-name="footer-col-list" data-file="components/Footer.js">
                  {columna.enlaces.map((enlace) => (
                    <li key={enlace.texto} data-name="footer-col-item" data-file="components/Footer.js">
                      <a
                        className="text-xs text-gray-400 hover:text-[#e83387] transition-colors"
                        href={enlace.href}
                        {...(enlace.externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        data-name="footer-link"
                        data-file="components/Footer.js"
                      >
                        {enlace.texto}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-9 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3" data-name="footer-bottom" data-file="components/Footer.js">
            <span className="text-xs text-gray-500" data-name="footer-copy" data-file="components/Footer.js">&copy; 2026 RomaHub</span>
            <span className="text-xs text-gray-500" data-name="footer-made" data-file="components/Footer.js">Hecho en Cuba para negocios de belleza</span>
          </div>
        </div>
      </footer>
    );
  } catch (error) {
    console.error('Footer component error:', error);
    return null;
  }
}
