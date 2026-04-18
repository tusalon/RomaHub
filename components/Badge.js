function Badge({ type, text }) {
  try {
    const styles = (() => {
      if (type === 'vip') return { bg: 'bg-[#1F2937]', fg: 'text-white', icon: 'icon-crown', iconColor: 'text-[#F59E0B]' };
      if (type === 'top') return { bg: 'bg-white', fg: 'text-[#1F2937]', icon: 'icon-star', iconColor: 'text-[#F59E0B]' };
      if (type === 'reservado') return { bg: 'bg-white', fg: 'text-[#1F2937]', icon: 'icon-flame', iconColor: 'text-[var(--primary-color)]' };
      if (type === 'mes') return { bg: 'bg-white', fg: 'text-[#1F2937]', icon: 'icon-award', iconColor: 'text-[var(--primary-color)]' };
      return { bg: 'bg-white', fg: 'text-[#1F2937]', icon: 'icon-info', iconColor: 'text-[var(--primary-color)]' };
    })();

    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1.5 chip-rr ${styles.bg} ${styles.fg}`} data-name="badge" data-file="components/Badge.js">
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[rgba(255,255,255,0.14)]" data-name="badge-ic-wrap" data-file="components/Badge.js">
          <div className={`${styles.icon} text-sm ${styles.iconColor || 'text-[var(--primary-color)]'}`} data-name="badge-ic" data-file="components/Badge.js"></div>
        </span>
        <span className="text-xs font-medium" data-name="badge-text" data-file="components/Badge.js">{text}</span>
      </span>
    );
  } catch (error) {
    console.error('Badge component error:', error);
    return null;
  }
}