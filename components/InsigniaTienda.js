// Insignias de confianza en RomaHub:
// - dorada: negocio de Rservasroma (suscripcion activa, no es tienda externa)
// - azul: tienda externa aprobada por el equipo tras revisar sus productos
// Antes ambas se mezclaban bajo un solo diamante 💎; ahora significan cosas
// distintas y una tienda externa sin aprobar no debe llevar ninguna.
function InsigniaTienda({ tipo, size = 'sm', chip = false }) {
  try {
    if (chip) {
      if (tipo === 'dorada') {
        return <span className="px-2.5 py-1 rounded-full bg-[#261D29] text-white text-[10px] font-bold shadow-sm" title="Negocio verificado Rservasroma" data-name="insignia-chip-dorada" data-file="components/InsigniaTienda.js">💎 VIP RservasRoma</span>;
      }
      if (tipo === 'azul') {
        return <span className="px-2.5 py-1 rounded-full bg-[#2563EB] text-white text-[10px] font-bold shadow-sm" title="Tienda verificada por RomaHub" data-name="insignia-chip-azul" data-file="components/InsigniaTienda.js">✓ Tienda verificada</span>;
      }
      return <span className="px-2.5 py-1 rounded-full bg-white/95 text-[10px] font-bold text-[var(--primary-color)] shadow-sm" data-name="insignia-chip-libre" data-file="components/InsigniaTienda.js">Tienda gratis</span>;
    }

    if (!tipo) return null;

    if (tipo === 'dorada') {
      return <span className={`shrink-0 ${size === 'lg' ? 'text-xl' : 'text-sm'}`} title="Negocio verificado Rservasroma" data-name="insignia-dorada" data-file="components/InsigniaTienda.js">💎</span>;
    }

    return (
      <span
        className={`inline-flex items-center justify-center rounded-full bg-[#2563EB] text-white shrink-0 ${size === 'lg' ? 'w-6 h-6 text-sm' : 'w-4 h-4 text-[10px]'}`}
        title="Tienda verificada por RomaHub"
        data-name="insignia-azul"
        data-file="components/InsigniaTienda.js"
      >
        ✓
      </span>
    );
  } catch (error) {
    console.error('InsigniaTienda component error:', error);
    return null;
  }
}
