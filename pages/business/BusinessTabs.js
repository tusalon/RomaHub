function BusinessTabs({ active, onChange }) {
  try {
    const tabs = [
      { key: 'portafolio', label: 'Portafolio', icon: 'icon-image' },
      { key: 'catalogo', label: 'Servicios y Productos', icon: 'icon-list' },
      { key: 'cursos', label: 'Cursos y Talleres', icon: 'icon-calendar' },
      { key: 'resenas', label: 'Reseñas', icon: 'icon-message-square' }
    ];

    return (
      <div className="container-rr mt-5" data-name="business-tabs" data-file="pages/business/BusinessTabs.js">
        <div className="surface-rr p-2" data-name="tabs-surface" data-file="pages/business/BusinessTabs.js">
          <div className="flex gap-2 overflow-x-auto no-scrollbar" data-name="tabs-row" data-file="pages/business/BusinessTabs.js">
            {tabs.map((t) => {
              const isActive = active === t.key;
              return (
                <button
                  key={t.key}
                  className={`btn-rr py-2.5 px-4 whitespace-nowrap flex items-center gap-2 relative ${isActive ? 'btn-primary-rr' : 'btn-ghost-rr'}`}
                  onClick={() => onChange?.(t.key)}
                  data-name="tab"
                  data-file="pages/business/BusinessTabs.js"
                >
                  <div className={`${t.icon} text-xl ${isActive ? 'text-white' : 'text-[var(--primary-color)]'}`} data-name="tab-i" data-file="pages/business/BusinessTabs.js"></div>
                  <span className="text-sm font-medium" data-name="tab-t" data-file="pages/business/BusinessTabs.js">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('BusinessTabs component error:', error);
    return null;
  }
}