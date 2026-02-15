-- Report Management System Database Schema

-- Create Database (run as postgres superuser)
-- DROP DATABASE IF EXISTS report_management_db;
CREATE DATABASE report_management_db;

-- Connect to the database
\c report_management_db;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create Users Table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Index on email for faster lookups
CREATE INDEX idx_users_email ON users(email);

-- Create Reports Table
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
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_status CHECK (status IN ('UPLOADED', 'PROCESSING', 'COMPLETED'))
);

-- Create Indexes for reports
CREATE INDEX idx_reports_user_id ON reports(user_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);

-- Create Enum for Report Status (PostgreSQL specific)
DO $$ BEGIN
    CREATE TYPE report_status AS ENUM ('UPLOADED', 'PROCESSING', 'COMPLETED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Insert sample user (password: 'password123' - BCrypt encoded)
INSERT INTO users (email, password) VALUES
('user@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'),
('admin@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy');

-- Insert sample reports
INSERT INTO reports (user_id, name, type, file_path, status, report_date) VALUES
(1, 'Blood Test Report', 'LAB_REPORT', '/uploads/user1_blood_test.pdf', 'COMPLETED', '2024-02-10'),
(1, 'MRI Scan Results', 'IMAGING', '/uploads/user1_mri_scan.pdf', 'PROCESSING', '2024-02-12'),
(2, 'X-Ray Chest', 'IMAGING', '/uploads/admin_xray.pdf', 'UPLOADED', '2024-02-14');
