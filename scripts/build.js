const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');

const bundles = {
  'index.bundle.js': [
    'utils/navigation.js',
    'utils/format.js',
    'utils/romahub-analytics.js',
    'utils/romahub-saved.js',
    'data/mockData.js',
    'data/testimonios.js',
    'components/ToastProvider.js',
    'components/Header.js',
    'components/Footer.js',
    'components/Badge.js',
    'components/InsigniaTienda.js',
    'components/StarRating.js',
    'components/SearchBar.js',
    'components/FavoriteButton.js',
    'components/BusinessLogoCard.js',
    'components/BusinessRail.js',
    'components/ProductCard.js',
    'components/ProductShowcase.js',
    'components/PromotionCard.js',
    'components/NegociosTestimonios.js',
    'components/RadarPrecios.js',
    // RomaReviewsRail.js y TopRatedCarousel.js quedan fuera a proposito: los
    // archivos siguen ahi por si se retoman, pero hoy no los renderiza ninguna
    // pagina y viajaban en el bundle sin pintar nada. Con la conexion cubana
    // en mente, no se envia JS que nadie ejecuta.
    'pages/home/HomeHero.js',
    'pages/home/AllBusinessesSection.js',
    'pages/home/HomePage.js',
    'app.js'
  ],
  'search.bundle.js': [
    'utils/navigation.js',
    'utils/format.js',
    'utils/romahub-analytics.js',
    'utils/romahub-saved.js',
    'data/mockData.js',
    'components/ToastProvider.js',
    'components/Header.js',
    'components/Footer.js',
    'components/Badge.js',
    'components/InsigniaTienda.js',
    'components/StarRating.js',
    'components/SearchBar.js',
    'components/FavoriteButton.js',
    'components/BusinessCard.js',
    'pages/search/SearchPage.js',
    'search-app.js'
  ],
  'business.bundle.js': [
    'utils/navigation.js',
    'utils/format.js',
    'utils/romahub-analytics.js',
    'utils/romahub-saved.js',
    'utils/romahub-orders.js',
    'data/mockData.js',
    'components/ToastProvider.js',
    'components/Header.js',
    'components/Footer.js',
    'components/Badge.js',
    'components/InsigniaTienda.js',
    'components/StarRating.js',
    'components/Accordion.js',
    'components/MasonryGrid.js',
    'components/ReviewCard.js',
    'components/MobileWhatsAppBar.js',
    'components/ReportarNegocio.js',
    'components/RomaHubUpgradePromo.js',
    'components/NegociosCerca.js',
    'components/ShareBusiness.js',
    'components/FavoriteButton.js',
    'components/PromotionCard.js',
    'pages/business/BusinessHeader.js',
    'pages/business/BusinessTabs.js',
    'pages/business/BusinessCatalog.js',
    'pages/business/BusinessReviews.js',
    'pages/business/BusinessPromotions.js',
    'pages/business/BusinessPage.js',
    'business-app.js'
  ],
  'orders.bundle.js': [
    'utils/navigation.js',
    'utils/format.js',
    'utils/romahub-saved.js',
    'utils/romahub-orders.js',
    'components/ToastProvider.js',
    'components/Header.js',
    'components/Footer.js',
    'pages/orders/RecentOrdersPage.js',
    'orders-app.js'
  ],
  'login.bundle.js': [
    'utils/navigation.js',
    'utils/romahub-saved.js',
    'utils/supabase-auth.js',
    'components/ToastProvider.js',
    'components/Header.js',
    'components/Footer.js',
    'pages/panel/LoginBusinessPage.js',
    'login-app.js'
  ],
  'tienda.bundle.js': [
    'utils/navigation.js',
    'utils/format.js',
    'utils/romahub-analytics.js',
    'utils/romahub-saved.js',
    'data/mockData.js',
    'components/ToastProvider.js',
    'components/Header.js',
    'components/Footer.js',
    'components/InsigniaTienda.js',
    'components/FavoriteButton.js',
    'components/ProductCard.js',
    'pages/tienda/TiendaPage.js',
    'tienda-app.js'
  ],
  'producto.bundle.js': [
    'utils/navigation.js',
    'utils/format.js',
    'utils/romahub-analytics.js',
    'utils/romahub-saved.js',
    'data/mockData.js',
    'components/ToastProvider.js',
    'components/Header.js',
    'components/Footer.js',
    'components/InsigniaTienda.js',
    'components/FavoriteButton.js',
    'components/ProductCard.js',
    'pages/producto/ProductoPage.js',
    'producto-app.js'
  ],
  'crear-tienda.bundle.js': [
    'utils/navigation.js',
    'utils/romahub-saved.js',
    'components/ToastProvider.js',
    'components/Header.js',
    'components/Footer.js',
    'pages/tienda/CrearTiendaPage.js',
    'crear-tienda-app.js'
  ],
  'panel.bundle.js': [
    'utils/navigation.js',
    'utils/format.js',
    'utils/romahub-analytics.js',
    'utils/romahub-saved.js',
    'utils/supabase-auth.js',
    'components/ToastProvider.js',
    'components/Header.js',
    'components/Footer.js',
    'components/ShareBusiness.js',
    'pages/panel/BusinessPanelPage.js',
    'panel-app.js'
  ],
  'favorites.bundle.js': [
    'utils/navigation.js',
    'utils/format.js',
    'utils/romahub-analytics.js',
    'utils/romahub-saved.js',
    'data/mockData.js',
    'components/ToastProvider.js',
    'components/Header.js',
    'components/Footer.js',
    'components/InsigniaTienda.js',
    'components/FavoriteButton.js',
    'components/PromotionCard.js',
    'pages/favorites/FavoritesPage.js',
    'favorites-app.js'
  ]
};

fs.mkdirSync(distDir, { recursive: true });

for (const [outFile, inputs] of Object.entries(bundles)) {
  const source = inputs
    .map((file) => `\n/* ${file} */\n${fs.readFileSync(path.join(root, file), 'utf8')}`)
    .join('\n');

  const result = babel.transformSync(source, {
    babelrc: false,
    configFile: false,
    presets: [['@babel/preset-react', { runtime: 'classic' }]],
    sourceType: 'script',
    compact: true,
    minified: true,
    comments: false
  });

  fs.writeFileSync(path.join(distDir, outFile), result.code, 'utf8');
}

const tailwindBin = path.join(root, 'node_modules', 'tailwindcss', 'lib', 'cli.js');

execFileSync(
  process.execPath,
  [tailwindBin, '-i', 'styles/tailwind-input.css', '-o', 'styles/tailwind.css', '--minify'],
  { cwd: root, stdio: 'inherit' }
);
