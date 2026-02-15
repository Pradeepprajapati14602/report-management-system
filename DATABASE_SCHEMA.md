# Database Schema Documentation

## Overview

This document describes the database schema for the Report Management System.

## Tables

### 1. Users

Stores user account information for authentication and authorization.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGSERIAL | PRIMARY KEY | Unique user identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User's email address (login) |
| password | VARCHAR(255) | NOT NULL | BCrypt hashed password |
| role | VARCHAR(20) | NOT NULL, DEFAULT 'USER' | User role (USER or ADMIN) |
| created_at | TIMESTAMP | DEFAULT NOW() | Account creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_users_email` on email column (for fast login lookup)

**Relationships:**
- One-to-many with reports table

---

### 2. Reports

Stores medical report information and processing status.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGSERIAL | PRIMARY KEY | Unique report identifier |
| user_id | BIGINT | NOT NULL, FOREIGN KEY | Reference to users table |
| name | VARCHAR(255) | NOT NULL | Report name/title |
| type | VARCHAR(100) | NOT NULL | Report type (LAB_REPORT, IMAGING, etc.) |
| file_path | VARCHAR(500) | NOT NULL | Path to uploaded file |
| status | VARCHAR(50) | NOT NULL, DEFAULT 'UPLOADED' | Processing status |
| summary | TEXT | NULL | Generated summary (when completed) |
| report_date | DATE | NULL | Date of the medical report |
| created_at | TIMESTAMP | DEFAULT NOW() | Report creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Enums/Values for `type` column:**
- `LAB_REPORT` - Laboratory test results
- `IMAGING` - X-Ray, MRI, CT scans
- `PATHOLOGY` - Pathology reports
- `PRESCRIPTION` - Medical prescriptions
- `DISCHARGE_SUMMARY` - Hospital discharge summary
- `OTHER` - Other types

**Enums/Values for `status` column:**
- `UPLOADED` - Initial state after upload
- `PROCESSING` - Report is being processed
- `COMPLETED` - Processing complete, summary available

**Indexes:**
- `idx_reports_user_id` on user_id column (for fast user lookup)
- `idx_reports_status` on status column (for filtering)
- `idx_reports_created_at` on created_at column (for sorting)

**Relationships:**
- Many-to-one with users table (each report belongs to one user)
- Cascade delete: when a user is deleted, their reports are also deleted

---

## Entity Relationship Diagram

```
┌─────────────────────────┐
│         users            │
├─────────────────────────┤
│ id (PK)                 │
│ email (UNIQUE)           │◄────┐
│ password                │      │
│ role                    │      │ 1
│ created_at              │      │
│ updated_at              │      │
└─────────────────────────┘      │
                                  │
                                  │
┌─────────────────────────┐      │
│        reports           │      │
├─────────────────────────┤      │
│ id (PK)                 │      │
│ user_id (FK)            │──────┘
│ name                    │
│ type                    │
│ file_path               │
│ status                  │
│ summary                 │
│ report_date             │
│ created_at              │
│ updated_at              │
└─────────────────────────┘
```

## Status Workflow State Machine

```
UPLOADED → PROCESSING → COMPLETED
   ↓            ↓
   ↓         Can stay in PROCESSING
   ↓            ↓
   ↓       COMPLETED (final state)
```

**Status Transitions:**
- UPLOADED → PROCESSING (user action: "Start Processing")
- PROCESSING → COMPLETED (user action: "Mark Complete")
- Once COMPLETED, status cannot change

## Sample Data

### Users

| id | email | password | role |
|----|-------|----------|------|
| 1 | user@example.com | $2a$10$... | USER |
| 2 | admin@example.com | $2a$10$... | ADMIN |

### Reports

| id | user_id | name | type | status | report_date |
|----|---------|------|------|--------|-------------|
| 1 | 1 | Blood Test Report | LAB_REPORT | UPLOADED | 2026-01-15 |
| 2 | 1 | Chest X-Ray | IMAGING | PROCESSING | 2026-01-16 |
| 3 | 1 | Annual Checkup | LAB_REPORT | COMPLETED | 2026-01-10 |

## SQL Queries

### Create Tables

```sql
-- Users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- Reports table
CREATE TABLE reports (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'UPLOADED',
    summary TEXT,
    report_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_reports_user_id ON reports(user_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_created_at ON reports(created_at);
```

### Useful Queries

```sql
-- Get all reports for a specific user
SELECT * FROM reports WHERE user_id = 1 ORDER BY created_at DESC;

-- Get reports by status
SELECT * FROM reports WHERE status = 'PROCESSING';

-- Get reports count by status
SELECT status, COUNT(*) as count
FROM reports
GROUP BY status;

-- Get user with their reports
SELECT u.email, COUNT(r.id) as report_count
FROM users u
LEFT JOIN reports r ON u.id = r.user_id
GROUP BY u.id, u.email;
```

## Migration History

| Version | File | Description |
|---------|------|-------------|
| 1 | V1__Create_Users_Table.sql | Create users table with indexes |
| 2 | V2__Create_Reports_Table.sql | Create reports table with foreign keys |
| 3 | V3__Insert_Sample_Data.sql | Insert sample users and reports |

---

**Note:** This schema is managed by Flyway migrations. Any changes should be done through new migration files, not manual SQL.
