function NegociosTestimonios() {
  try {
    // Lista compartida con RegisterBusinessPage.js — ver data/testimonios.js.
    // Se titula "lo que dicen los negocios" (no clientas) para no mezclarse
    // con el ranking del directorio, que solo usa valoraciones verificadas.
    const testimonios = window.TESTIMONIOS_NEGOCIOS || [];

    const inicial = (nombre) => String(nombre || '?').trim().charAt(0).toUpperCase();

    return (
      <section className="mt-12" data-name="negocios-testimonios" data-file="components/NegociosTestimonios.js">
        <div className="container-rr" data-name="testimonios-inner" data-file="components/NegociosTestimonios.js">
          <div className="mb-5" data-name="testimonios-head" data-file="components/NegociosTestimonios.js">
            <span className="kicker-rr block mb-2" data-name="testimonios-badge" data-file="components/NegociosTestimonios.js">Quienes ya lo usan</span>
            <h2 className="text-2xl md:text-[26px] font-extrabold tracking-[-0.02em] text-[#261D29]" data-name="testimonios-title" data-file="components/NegociosTestimonios.js">
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
                  <div className="w-9 h-9 rounded-full bg-[rgba(104,24,49,0.10)] flex items-center justify-center shrink-0 text-sm font-bold text-[#681831]" aria-hidden="true" data-name="testimonio-inicial" data-file="components/NegociosTestimonios.js">
                    {inicial(t.nombre)}
                  </div>
                  <div className="min-w-0" data-name="testimonio-autor-copy" data-file="components/NegociosTestimonios.js">
                    <p className="text-sm font-semibold text-[#261D29] truncate" data-name="testimonio-nombre" data-file="components/NegociosTestimonios.js">{t.nombre}</p>
                    <p className="text-xs text-[var(--text-muted)] truncate" data-name="testimonio-negocio" data-file="components/NegociosTestimonios.js">{t.negocio}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="mt-5 surface-rr p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between" data-name="testimonios-cta" data-file="components/NegociosTestimonios.js">
            <div data-name="testimonios-cta-copy" data-file="components/NegociosTestimonios.js">
              <p className="text-sm font-bold text-[#261D29]" data-name="testimonios-cta-title" data-file="components/NegociosTestimonios.js">
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
