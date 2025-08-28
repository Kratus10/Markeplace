const fs = require('fs');
const path = require('path');
const parser = require('i18next-scanner').parser;
const vfs = require('vinyl-fs');

const localesDir = path.join(__dirname, '../locales');
const defaultLocale = 'en';

// Create a parser instance
const i18nParser = parser({
  defaultNs: 'common',
  defaultValue: (lng, ns, key) => key,
  keySeparator: false,
  nsSeparator: false,
  resource: {
    savePath: '{{lng}}/{{ns}}.json',
  },
});

// Scan files for i18n keys
vfs.src([
  'app/**/*.{ts,tsx,js,jsx}',
  'components/**/*.{ts,tsx,js,jsx}',
  'lib/**/*.{ts,tsx,js,jsx}',
  '!**/node_modules/**',
])
  .pipe(i18nParser)
  .pipe(vfs.dest(localesDir));

// Create a function to merge translations
function mergeTranslations(newKeys, locale) {
  const filePath = path.join(localesDir, locale, 'common.json');
  
  try {
    const existing = fs.existsSync(filePath) ? 
      JSON.parse(fs.readFileSync(filePath, 'utf8')) : {};
    
    // Merge new keys without overwriting existing translations
    const merged = {...existing};
    for (const key of newKeys) {
      if (!(key in merged)) {
        merged[key] = key; // Use key as default value
      }
    }
    
    fs.writeFileSync(filePath, JSON.stringify(merged, null, 2));
    console.log(`Updated ${locale}/common.json`);
  } catch (err) {
    console.error(`Error updating ${locale}/common.json:`, err);
  }
}

// After scanning, merge new keys into all locales
i18nParser.on('end', function() {
  const newKeys = Object.keys(this.get().en.common);
  
  fs.readdirSync(localesDir).forEach(locale => {
    if (fs.lstatSync(path.join(localesDir, locale)).isDirectory()) {
      mergeTranslations(newKeys, locale);
    }
  });
  
  console.log('i18n extraction complete!');
});
