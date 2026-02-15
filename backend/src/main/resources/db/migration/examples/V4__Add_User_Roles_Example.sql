-- ========================================
-- EXAMPLE MIGRATION: Add User Roles
-- ========================================
-- Usage: Rename this file to V4__Add_User_Roles.sql to use it

-- Add role column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'USER';

-- Create enum type for roles (PostgreSQL specific)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('USER', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Update existing users
UPDATE users SET role = 'ADMIN' WHERE email LIKE '%admin%';
UPDATE users SET role = 'USER' WHERE role IS NULL;

-- Alter column to use enum
-- ALTER TABLE users ALTER COLUMN role TYPE user_role USING role::user_role;

-- Add check constraint
ALTER TABLE users ADD CONSTRAINT chk_role CHECK (role IN ('USER', 'ADMIN'));

-- Add index for role-based queries
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

COMMENT ON COLUMN users.role IS 'User role (USER or ADMIN)';
