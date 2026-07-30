function NegociosTestimonios() {
  try {
    // Testimonios reales publicados en la landing de Rservasroma
    // (tusalon.github.io/HouseofRservasRoma). Son duenas de negocio hablando
    // de la app, NO clientas valorando salones: por eso la seccion se titula
    // "lo que dicen los negocios" y no se mezcla con el ranking del directorio,
    // que se alimenta solo de valoraciones verificadas de clientas.
    const testimonios = [
      {
        id: 'yuliet',
        texto: 'Antes perdía horas confirmando citas por WhatsApp. Ahora las clientas reservan solas y yo recibo la notificación. En serio, cambió todo.',
        nombre: 'Yuliet M.',
        negocio: 'Exotic Nails · La Habana'
      },
      {
        id: 'carla',
        texto: 'Por muy poco cada mes tengo una app con mi nombre, mis colores y mis servicios. Las clientas piensan que invertí miles. Lo recomiendo sin dudar.',
        nombre: 'Carla R.',
        negocio: 'Nails Carla Salon · Cuba'
      },
      {
        id: 'leci',
        texto: 'Los anticipos me salvaron. Antes las clientas cancelaban y yo perdía el turno. Ahora pagan para reservar y las ausencias bajaron a cero.',
        nombre: 'Leci N.',
        negocio: "Leci's Nails · Cuba"
      }
    ];

    const inicial = (nombre) => String(nombre || '?').trim().charAt(0).toUpperCase();

    return (
      <section className="mt-12" data-name="negocios-testimonios" data-file="components/NegociosTestimonios.js">
        <div className="container-rr" data-name="testimonios-inner" data-file="components/NegociosTestimonios.js">
          <div className="mb-5" data-name="testimonios-head" data-file="components/NegociosTestimonios.js">
            <span className="kicker-rr block mb-2" data-name="testimonios-badge" data-file="components/NegociosTestimonios.js">Quienes ya lo usan</span>
            <h2 className="text-2xl md:text-[26px] font-extrabold tracking-[-0.02em] text-[#2A1620]" data-name="testimonios-title" data-file="components/NegociosTestimonios.js">
              Lo que dicen los negocios
            </h2>
            <p className="mt-2 text-sm text-[var(--text-muted)] leading-relaxed max-w-xl" data-name="testimonios-sub" data-file="components/NegociosTestimonios.js">
              Duenas de salon que ya reciben sus reservas con Rservasroma, la app detras de RomaHub.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-name="testimonios-grid" data-file="components/NegociosTestimonios.js">
            {testimonios.map((t) => (
              <figure key={t.id} className="surface-rr card-lift-rr p-5 flex flex-col" data-name="testimonio-card" data-file="components/NegociosTestimonios.js">
                <div className="flex items-center gap-1" aria-label="5 de 5 estrellas" data-name="testimonio-stars" data-file="components/NegociosTestimonios.js">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="icon-star text-sm text-[#F59E0B]" aria-hidden="true" data-name="testimonio-star" data-file="components/NegociosTestimonios.js"></div>
                  ))}
                </div>
                <blockquote className="mt-3 text-sm text-[var(--text-soft)] leading-relaxed flex-1" data-name="testimonio-texto" data-file="components/NegociosTestimonios.js">
                  {t.texto}
                </blockquote>
                <figcaption className="mt-4 pt-4 border-t border-[var(--border)] flex items-center gap-3" data-name="testimonio-autor" data-file="components/NegociosTestimonios.js">
                  <div className="w-9 h-9 rounded-full bg-[rgba(181,0,99,0.10)] flex items-center justify-center shrink-0 text-sm font-bold text-[#B50063]" aria-hidden="true" data-name="testimonio-inicial" data-file="components/NegociosTestimonios.js">
                    {inicial(t.nombre)}
                  </div>
                  <div className="min-w-0" data-name="testimonio-autor-copy" data-file="components/NegociosTestimonios.js">
                    <p className="text-sm font-semibold text-[#2A1620] truncate" data-name="testimonio-nombre" data-file="components/NegociosTestimonios.js">{t.nombre}</p>
                    <p className="text-xs text-[var(--text-muted)] truncate" data-name="testimonio-negocio" data-file="components/NegociosTestimonios.js">{t.negocio}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="mt-5 surface-rr p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between" data-name="testimonios-cta" data-file="components/NegociosTestimonios.js">
            <div data-name="testimonios-cta-copy" data-file="components/NegociosTestimonios.js">
              <p className="text-sm font-bold text-[#2A1620]" data-name="testimonios-cta-title" data-file="components/NegociosTestimonios.js">
                ¿Tienes un salon y quieres aparecer aqui?
              </p>
              <p className="mt-1 text-sm text-[var(--text-muted)] leading-relaxed" data-name="testimonios-cta-sub" data-file="components/NegociosTestimonios.js">
                Aparecer en RomaHub es gratis. La agenda online va con Rservasroma: 15 dias de prueba, luego 1,500 CUP al mes en Cuba.
              </p>
            </div>
            <a
              className="btn-rr btn-primary-rr shrink-0 flex items-center justify-center gap-2"
              href="register.html"
              data-name="testimonios-cta-btn"
              data-file="components/NegociosTestimonios.js"
            >
              Abrir mi tienda gratis
              <div className="icon-arrow-right text-xl text-white" aria-hidden="true" data-name="testimonios-cta-i" data-file="components/NegociosTestimonios.js"></div>
            </a>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('NegociosTestimonios component error:', error);
    return null;
  }
}
