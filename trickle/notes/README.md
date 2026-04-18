# Rservas.Roma Marketplace (Cuba) — Notas del proyecto

Este proyecto es un marketplace premium de belleza y servicios para el mercado inicial de Cuba. Todo el texto visible y los datos de ejemplo están en español. El branding oficial usa Roma Pink (#D81B60) como color primario y acentos dorados para VIP/Top Roma.

## Páginas (MPA)

- `index.html` → Inicio: “El Muro de la Intriga”, hero con búsqueda y carrusel de “Mejor calificados”.
- `search.html` → Resultados: vista dividida lista + mapa en escritorio, alternancia “Ver mapa / Ver lista” en móvil.
- `business.html` → Perfil: portada, logo superpuesto, badges (VIP, Top Roma, Más reservado, Negocio del Mes), pestañas, portafolio masonry, catálogo híbrido en acordeón, reseñas verificadas y barra fija móvil “Contactar por WhatsApp”.

## Datos de ejemplo

Los datos viven en `data/mockData.js` y cubren:
- Negocios VIP y Free
- Servicios, productos, cursos y talleres
- Reseñas verificadas

## Regla de mantenimiento

Cuando se actualice el proyecto:
- Revisa si cambió la estructura de páginas, navegación o textos principales y actualiza este README.
- Si se agregan nuevas imágenes o recursos públicos, crea un nuevo archivo JSON por recurso en `trickle/assets/` con `url` y `description`.
- Si se incorporan nuevas normas o el usuario enfatiza reglas críticas, crea/actualiza un archivo en `trickle/rules/`.