function Accordion({ items }) {
  try {
    const [open, setOpen] = React.useState(() => {
      try {
        return items?.length ? items[0].key : null;
      } catch (e) {
        return null;
      }
    });

    return (
      <div className="space-y-3" data-name="accordion" data-file="components/Accordion.js">
        {(items || []).map((it) => {
          const isOpen = open === it.key;
          return (
            <div key={it.key} className="surface-rr overflow-hidden" data-name="accordion-item" data-file="components/Accordion.js">
              <button
                className="w-full flex items-center justify-between gap-3 px-4 py-4 hover:bg-[rgba(11,18,32,0.03)] transition-colors"
                onClick={() => setOpen((v) => (v === it.key ? null : it.key))}
                data-name="accordion-trigger"
                data-file="components/Accordion.js"
                aria-expanded={isOpen}
              >
                <div className="min-w-0 text-left" data-name="accordion-trigger-left" data-file="components/Accordion.js">
                  <p className="text-sm font-semibold" data-name="accordion-title" data-file="components/Accordion.js">{it.title}</p>
                  {it.subtitle ? <p className="text-xs text-[var(--text-muted)] mt-1" data-name="accordion-sub" data-file="components/Accordion.js">{it.subtitle}</p> : null}
                </div>
                <div className={`w-10 h-10 rounded-2xl border border-[var(--border)] bg-white flex items-center justify-center`} data-name="accordion-iconwrap" data-file="components/Accordion.js">
                  <div className={`${isOpen ? 'icon-chevron-up' : 'icon-chevron-down'} text-xl text-[var(--primary-color)]`} data-name="accordion-icon" data-file="components/Accordion.js"></div>
                </div>
              </button>

              {isOpen ? (
                <div className="px-4 pb-4" data-name="accordion-panel" data-file="components/Accordion.js">
                  <div className="divider-rr mb-4" data-name="accordion-divider" data-file="components/Accordion.js"></div>
                  <div className="space-y-2" data-name="accordion-list" data-file="components/Accordion.js">
                    {(it.rows || []).map((row, idx) => (
                      <div key={`${it.key}-${idx}`} className="flex items-start gap-3 py-2" data-name="accordion-row" data-file="components/Accordion.js">
                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[var(--secondary-color)] shrink-0" data-name="row-icwrap" data-file="components/Accordion.js">
                          <div className={`${row.icon} text-xl text-[var(--primary-color)]`} data-name="row-icon" data-file="components/Accordion.js"></div>
                        </div>
                        <div className="min-w-0 flex-1" data-name="row-main" data-file="components/Accordion.js">
                          <p className="text-sm font-medium leading-snug" data-name="row-title" data-file="components/Accordion.js">{row.title}</p>
                          {row.meta ? <p className="text-xs text-[var(--text-muted)] mt-1" data-name="row-meta" data-file="components/Accordion.js">{row.meta}</p> : null}
                        </div>
                        <div className="text-right" data-name="row-right" data-file="components/Accordion.js">
                          <p className="text-sm font-semibold tabular-nums" data-name="row-price" data-file="components/Accordion.js">{row.price}</p>
                          {row.note ? <p className="text-[11px] text-[var(--text-muted)] mt-1" data-name="row-note" data-file="components/Accordion.js">{row.note}</p> : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    );
  } catch (error) {
    console.error('Accordion component error:', error);
    return null;
  }
}