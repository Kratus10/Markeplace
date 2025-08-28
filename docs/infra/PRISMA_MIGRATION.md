# Prisma Migration Workflow

## Local Development
```bash
npx prisma migrate dev --name <migration_name>
```

## CI/Production Deployment
```bash
npx prisma migrate deploy
```

## Migration Review Process
1. Review SQL diffs in Pull Request
2. Run migrations in staging environment
3. Perform database backup
4. Apply to production

## Zero-Downtime Tips
- Add nullable columns first
- Backfill data in background
- Later make columns NOT NULL
- Use transactions for multiple changes
- Test migrations with production-like data volumes

## Best Practices
- Always review generated SQL before applying to production
- Test migrations in staging environment that mirrors production
- Use `prisma migrate diff` to generate SQL for review
- Schedule migrations during low-traffic periods
- Monitor database performance during migration
