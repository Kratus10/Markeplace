const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../locales');
const defaultLocale = 'en';

try {
  // Get all keys from the default locale
  const defaultPath = path.join(localesDir, defaultLocale, 'common.json');
  const defaultKeys = Object.keys(JSON.parse(fs.readFileSync(defaultPath, 'utf8')));
  
  let hasErrors = false;
  
  // Check other locales
  fs.readdirSync(localesDir).forEach(locale => {
    if (locale === defaultLocale || !fs.lstatSync(path.join(localesDir, locale)).isDirectory()) {
      return;
    }
    
    const localePath = path.join(localesDir, locale, 'common.json');
    if (!fs.existsSync(localePath)) {
      console.error(`❌ Missing common.json for locale: ${locale}`);
      hasErrors = true;
      return;
    }
    
    const localeKeys = Object.keys(JSON.parse(fs.readFileSync(localePath, 'utf8')));
    const missingKeys = defaultKeys.filter(key => !localeKeys.includes(key));
    
    if (missingKeys.length > 0) {
      console.error(`❌ Locale ${locale} is missing ${missingKeys.length} keys:`);
      console.error(missingKeys.join(', '));
      hasErrors = true;
    } else {
      console.log(`✅ Locale ${locale} has all required keys`);
    }
  });
  
  if (hasErrors) {
    console.error('❌ i18n check failed: Some locales are missing keys');
    process.exit(1);
  }
  
  console.log('✅ i18n check passed: All locales have the required keys');
} catch (error) {
  console.error('❌ Error during i18n check:', error);
  process.exit(1);
}
