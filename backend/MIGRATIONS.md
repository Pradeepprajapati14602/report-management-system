# Database Migration Guide

## Flyway Migrations

This project uses **Flyway** for database migrations.

## Migration Files Location

```
backend/src/main/resources/db/migration/
├── V1__Create_Users_Table.sql
├── V2__Create_Reports_Table.sql
└── V3__Insert_Sample_Data.sql
```

## Migration Naming Convention

Flyway migrations follow this naming convention:

```
V{VERSION}__{DESCRIPTION}.sql
```

**Example:**
- `V1__Create_Users_Table.sql` - Version 1
- `V2__Create_Reports_Table.sql` - Version 2
- `V3__Insert_Sample_Data.sql` - Version 3
- `V4__Add_User_Roles.sql` - Version 4 (new migration)

## How Migrations Work

1. **First Time Start**:
   - Flyway automatically creates `flyway_schema_history` table
   - All migrations run in order

2. **Subsequent Starts**:
   - Flyway checks which migrations have already run
   - Only new migrations run

3. **Validation**:
   - `ddl-auto: validate` - Hibernate validates schema
   - Error if schema doesn't match

## Creating New Migrations

### Step 1: Create New Migration File

```sql
-- V4__Add_User_Roles.sql
-- Description: Add role column to users table

ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'USER';
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@example.com';
```

### Step 2: Restart Application

Spring Boot will automatically run new migrations on startup.

## Migration Commands

### Check Migration Status (pgAdmin)

```sql
-- View migrations
SELECT * FROM flyway_schema_history ORDER BY installed_rank;
```

### Manual Migration Rollback

**WARNING**: Flyway community edition doesn't support rollback!

For rollback:

**Option 1: Manual SQL**
```sql
-- Reverse the changes manually
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Remove from flyway history
DELETE FROM flyway_schema_history WHERE version = '3';
```

**Option 2: Baseline Migration**
```yaml
spring:
  flyway:
    baseline-on-migrate: true
    baseline-version: 0
```

## Best Practices

### DO'S:
1. **Always increment version** - V1, V2, V3...
2. **Use descriptive names** - V2__Create_Reports_Table.sql
3. **One change per migration** - Tables, indexes, data - separate files
4. **Test locally first** - Test in pgAdmin
5. **Use transactions** - Each migration should be atomic
6. **Add comments** - Why the change was made

### DON'TS:
1. **Never modify existing migrations** - Create new file
2. **Don't skip versions** - V1, V2, V3... (not V1, V3, V5)
3. **Don't use DDL in loops** - Use direct SQL
4. **Don't forget foreign keys** - Order matters (users first, then reports)

## Current Migrations

| Version | File | Description |
|---------|------|-------------|
| 1 | V1__Create_Users_Table.sql | Users table with indexes |
| 2 | V2__Create_Reports_Table.sql | Reports table with foreign keys |
| 3 | V3__Insert_Sample_Data.sql | Sample users and reports |

## Troubleshooting

### Migration Failed?

**Step 1:** Check error logs
```
Check Spring Boot console output
```

**Step 2:** Fix the issue
```sql
-- Manual fix in pgAdmin
```

**Step 3:** Repair Flyway
```sql
DELETE FROM flyway_schema_history WHERE version = 'failed_version';
-- Then restart application
```

### Schema Mismatch Error?

```yaml
# Temporary fix - for development only
spring:
  jpa:
    hibernate:
      ddl-auto: update  # Warning: Don't use in production!
```

Then fix the migration and use `validate`.

## Production Deployment

1. **Pre-production test**
   ```bash
   # Run in test environment first
   mvn spring-boot:run -Dspring.profiles.active=test
   ```

2. **Backup database**
   ```sql
   pg_dump report_management_db > backup.sql
   ```

3. **Deploy with migrations**
   ```bash
   java -jar backend.jar
   ```

4. **Verify migrations**
   ```sql
   SELECT * FROM flyway_schema_history;
   ```

## Useful SQL Queries

```sql
-- Tables list
\dt

-- Schema info
SELECT schemaname, tablename FROM pg_tables WHERE schemaname = 'public';

-- Foreign keys
SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY';
```

## Resources

- [Flyway Documentation](https://docs.red-gate.com/flyway)
- [Spring Boot Flyway Guide](https://docs.spring.io/spring-boot/docs/current/reference/html/howto.html#howto.data-initialization.migration-tool.flyway)
