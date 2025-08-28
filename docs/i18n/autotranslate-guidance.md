# Auto-translation Guidance

## When to Use Auto-translation

- Draft versions of UI copy
- Internal tools and admin interfaces
- Temporary placeholder content
- Rapid prototyping and testing

## When NOT to Use Auto-translation

- Legal documents (Terms of Service, Privacy Policy)
- Product descriptions for customer-facing content
- Marketing copy and promotional materials
- Sensitive or culturally specific content

## Best Practices

1. **Always review** auto-translated content with a native speaker
2. **Maintain a glossary** of product-specific terms
3. **Track translation provenance** in metadata:
   ```json
   {
     "translated_by": "Google Translate",
     "translation_date": "2025-08-21",
     "review_status": "pending"
   }
   ```
4. **Set quality expectations** - auto-translation is typically 70-85% accurate
5. **Provide context** to the translation system when possible
6. **Flag auto-translated content** in the UI with a visual indicator

## Reviewer Workflow

1. Auto-translated content is marked with `"needs_review": true`
2. Reviewers check content against the original
3. Reviewers update the status:
   ```json
   {
     "reviewed_by": "reviewer@example.com",
     "review_date": "2025-08-22",
     "needs_review": false
   }
   ```

## Glossary Management

Maintain a glossary of key terms in `/i18n/glossary.json`:
```json
{
  "license": {
    "context": "Software licensing terms",
    "translations": {
      "es": "licencia",
      "fr": "licence"
    }
  },
  "indicator": {
    "context": "Trading indicator",
    "translations": {
      "es": "indicador",
      "fr": "indicateur"
    }
  }
}
