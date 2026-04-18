function MasonryGrid({ images }) {
  try {
    const imgs = images || [];
    const cols = [
      imgs.filter((_, i) => i % 3 === 0),
      imgs.filter((_, i) => i % 3 === 1),
      imgs.filter((_, i) => i % 3 === 2)
    ];

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3" data-name="masonry" data-file="components/MasonryGrid.js">
        {cols.map((column, ci) => (
          <div key={`col-${ci}`} className="space-y-3" data-name="masonry-col" data-file="components/MasonryGrid.js">
            {column.map((src, idx) => (
              <div key={`${ci}-${idx}`} className="surface-rr overflow-hidden" data-name="masonry-item" data-file="components/MasonryGrid.js">
                <img src={src} alt="Foto del portafolio" className="w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-300" data-name="masonry-img" data-file="components/MasonryGrid.js" />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  } catch (error) {
    console.error('MasonryGrid component error:', error);
    return null;
  }
}