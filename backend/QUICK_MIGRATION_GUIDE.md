# Quick Migration Guide

## Setup Complete!

Flyway migrations are now set up.

## Files Created

```
backend/
├── src/main/resources/db/migration/
│   ├── V1__Create_Users_Table.sql       - Users table
│   ├── V2__Create_Reports_Table.sql     - Reports table
│   └── V3__Insert_Sample_Data.sql       - Sample data
├── src/main/resources/db/migration/examples/
│   ├── V4__Add_User_Roles_Example.sql   - Example: Add roles
│   └── V5__Add_Report_Tags_Example.sql  - Example: Add tags
├── MIGRATIONS.md                         - Full documentation
└── config/FlywayConfig.java              - Configuration
```

## Quick Start

### 1. Start the Backend

```powershell
cd C:\med\report-management-system\backend
mvn clean install
mvn spring-boot:run
```

### 2. Flyway Runs Automatically

- First time: All migrations run (V1, V2, V3)
- Future: Only new migrations run

### 3. Verify in pgAdmin

```sql
-- Check migrations
SELECT * FROM flyway_schema_history ORDER BY installed_rank;
```

Output:
| installed_rank | version | description | success |
|----------------|---------|-------------|---------|
| 1 | 1 | Create Users Table | true |
| 2 | 2 | Create Reports Table | true |
| 3 | 3 | Insert Sample Data | true |

## How to Create New Migration?

### Step 1: Create New File

```
V4__Your_Description_Here.sql
```

**Important:**
- Start with `V`
- Increment version number (V4, V5, V6...)
- Use `__` (double underscore)
- Use descriptive name

### Step 2: Write SQL

```sql
-- V4__Add_User_Phone.sql
ALTER TABLE users ADD COLUMN phone VARCHAR(20);
```

### Step 3: Restart Backend

```powershell
mvn spring-boot:run
```

Done! Migration will run automatically.

## Migration Examples

### Add Column
```sql
ALTER TABLE users ADD COLUMN phone VARCHAR(20);
ALTER TABLE users ADD COLUMN address TEXT;
```

### Create Index
```sql
CREATE INDEX idx_users_phone ON users(phone);
```

### Add Constraint
```sql
ALTER TABLE users ADD CONSTRAINT chk_phone
CHECK (phone ~ '^[0-9]{10}$');
```

### Insert Data
```sql
INSERT INTO users (email, password) VALUES
('test@example.com', '$2a$10$...');
```

### Create Table
```sql
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    action VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);
```

## Migration Rules

**Follow these:**
1. Increment version: V1 → V2 → V3
2. Use double underscore: `V4__Description.sql`
3. One file per change
4. Test before deploying
5. Use IF NOT EXISTS / IF EXISTS

**Avoid these:**
1. Don't modify old migrations
2. Don't skip versions (V1, V3, V5 - wrong!)
3. Don't use duplicate versions
4. Don't forget foreign keys order

## Troubleshooting

### Migration Failed?

1. Check error in console
2. Fix manually in pgAdmin
3. Delete failed migration:
   ```sql
   DELETE FROM flyway_schema_history WHERE version = 'failed_version';
   ```
4. Restart backend

### Want to Reset?

**WARNING: Don't do this in production!**

```sql
-- Drop all tables
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-- Reset Flyway
DELETE FROM flyway_schema_history;

-- Restart backend - migrations will run fresh
```

## Current Schema

### Tables:
- **users** - User accounts
- **reports** - Medical reports

### Login Credentials:
- Email: `user@example.com`
- Password: `password123`

## Need Help?

- Full Guide: [MIGRATIONS.md](MIGRATIONS.md)
- Flyway Docs: https://flywaydb.org/documentation

## Next Steps

1. Migrations setup complete
2. Start the backend
3. Verify in pgAdmin
4. Start building features!

---

**Tips:**
- Migrations are tracked in version control
- Consistent schema for team members
- Safe and easy production deployment
- Rollback support with planning
