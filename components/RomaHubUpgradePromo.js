function RomaHubUpgradePromo({ nombreNegocio }) {
  try {
    const mensaje = `Hola, tengo mi tienda "${nombreNegocio || ''}" en RomaHub y quiero saber cómo activar Rservasroma para recibir reservas online.`;
    const waHref = `https://wa.me/15154650340?text=${encodeURIComponent(mensaje)}`;

    return (
      <div className="surface-rr overflow-hidden" data-name="romahub-upgrade-promo" data-file="components/RomaHubUpgradePromo.js">
        <div className="relative h-28 overflow-hidden bg-[#F3F4F6]" data-name="upgrade-promo-media" data-file="components/RomaHubUpgradePromo.js">
          <img
            loading="lazy"
            decoding="async"
            src="https://tusalon.github.io/HouseofRservasRoma/assets/screenshots/admin-agenda.jpg"
            alt="Agenda de reservas de Rservasroma"
            className="w-full h-full object-cover object-top"
            data-name="upgrade-promo-img"
            data-file="components/RomaHubUpgradePromo.js"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" data-name="upgrade-promo-gradient" data-file="components/RomaHubUpgradePromo.js"></div>
          <p className="absolute left-3 bottom-2 text-white text-xs font-bold" data-name="upgrade-promo-tag" data-file="components/RomaHubUpgradePromo.js">💎 Así se ve un negocio con Rservasroma</p>
        </div>
        <div className="p-4" data-name="upgrade-promo-body" data-file="components/RomaHubUpgradePromo.js">
          <p className="text-sm font-bold text-[#111827] leading-snug" data-name="upgrade-promo-title" data-file="components/RomaHubUpgradePromo.js">
            ¿Y si tus clientas también reservaran solas?
          </p>
          <p className="mt-1.5 text-xs text-[var(--text-muted)] leading-relaxed" data-name="upgrade-promo-copy" data-file="components/RomaHubUpgradePromo.js">
            Con Rservasroma tienes agenda online, recordatorios automáticos y tu propio enlace de reservas. 15 días de prueba gratis, luego 1,500 CUP al mes.
          </p>
          <a
            className="mt-3 btn-rr btn-primary-rr w-full flex items-center justify-center gap-2 text-sm"
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            data-name="upgrade-promo-cta"
            data-file="components/RomaHubUpgradePromo.js"
          >
            Quiero mi agenda de reservas
            <div className="icon-arrow-right text-lg text-white" data-name="upgrade-promo-cta-i" data-file="components/RomaHubUpgradePromo.js"></div>
          </a>
        </div>
      </div>
    );
  } catch (error) {
    console.error('RomaHubUpgradePromo component error:', error);
    return null;
  }
}
