# Localization (i18n) Guide

This guide provides instructions for managing translations in our application.

## Adding a New Locale

1. Create a new folder in `locales/` for your locale code (e.g., `locales/fr/`)
2. Copy the `common.json` file from an existing locale
3. Translate all string values
4. Add the locale to `SUPPORTED_LOCALES` in your .env file:
   ```
   SUPPORTED_LOCALES=en,es,fr
   ```
5. Add the locale to Next.js config:
   ```js
   // next.config.js
   i18n: {
     locales: ["en", "es", "fr"],
     // ...
   }
   ```

## Translation Ownership

- **UI Copy**: Maintained by the frontend team in `locales/` JSON files
- **Product Metadata**: Managed by product owners via the Admin UI
- **Legal Documents**: Requires legal team review before deployment

## CI Checks

We have two scripts for translation management:

```bash
# Extract translation keys from code
npm run i18n:extract

# Check for missing translations
npm run i18n:check
```

## Review Process

1. All translations go through peer review
2. Legal documents require sign-off from legal counsel
3. Product translations are reviewed by product owners

## CMS Integration

We support two integration paths:
1. Git-based: Edit JSON files directly and submit PRs
2. Headless CMS: Connect Sanity/Contentful to update product translations
