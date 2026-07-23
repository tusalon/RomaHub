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
    'data/mockData.js',
    'components/ToastProvider.js',
    'components/Header.js',
    'components/Footer.js',
    'components/Badge.js',
    'components/StarRating.js',
    'components/SearchBar.js',
    'components/BusinessLogoCard.js',
    'components/BusinessRail.js',
    'components/RomaReviewsRail.js',
    'components/TopRatedCarousel.js',
    'pages/home/HomeHero.js',
    'pages/home/AllBusinessesSection.js',
    'pages/home/HomePage.js',
    'app.js'
  ],
  'search.bundle.js': [
    'utils/navigation.js',
    'utils/format.js',
    'data/mockData.js',
    'components/ToastProvider.js',
    'components/Header.js',
    'components/Footer.js',
    'components/Badge.js',
    'components/StarRating.js',
    'components/SearchBar.js',
    'components/BusinessCard.js',
    'components/MapSplitView.js',
    'pages/search/SearchPage.js',
    'search-app.js'
  ],
  'business.bundle.js': [
    'utils/navigation.js',
    'utils/format.js',
    'data/mockData.js',
    'components/ToastProvider.js',
    'components/Header.js',
    'components/Footer.js',
    'components/Badge.js',
    'components/StarRating.js',
    'components/Accordion.js',
    'components/MasonryGrid.js',
    'components/ReviewCard.js',
    'components/MobileWhatsAppBar.js',
    'pages/business/BusinessHeader.js',
    'pages/business/BusinessTabs.js',
    'pages/business/BusinessCatalog.js',
    'pages/business/BusinessReviews.js',
    'pages/business/BusinessPage.js',
    'business-app.js'
  ],
  'register.bundle.js': [
    'utils/navigation.js',
    'components/ToastProvider.js',
    'components/Header.js',
    'components/Footer.js',
    'pages/register/RegisterBusinessPage.js',
    'register-app.js'
  ],
  'login.bundle.js': [
    'utils/navigation.js',
    'utils/supabase-auth.js',
    'components/ToastProvider.js',
    'components/Header.js',
    'components/Footer.js',
    'pages/panel/LoginBusinessPage.js',
    'login-app.js'
  ],
  'panel.bundle.js': [
    'utils/navigation.js',
    'utils/format.js',
    'utils/supabase-auth.js',
    'components/ToastProvider.js',
    'components/Header.js',
    'components/Footer.js',
    'pages/panel/BusinessPanelPage.js',
    'panel-app.js'
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

