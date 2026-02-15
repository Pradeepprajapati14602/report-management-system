-- Migration V3: Insert Sample Data
-- Report Management System

-- Insert sample users (password: 'password123' - BCrypt encoded)
INSERT INTO users (email, password) VALUES
('user@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'),
('admin@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy');

-- Insert sample reports
INSERT INTO reports (user_id, name, type, file_path, status, report_date) VALUES
(1, 'Blood Test Report', 'LAB_REPORT', '/uploads/user1_blood_test.pdf', 'COMPLETED', '2024-02-10'),
(1, 'MRI Scan Results', 'IMAGING', '/uploads/user1_mri_scan.pdf', 'PROCESSING', '2024-02-12'),
(2, 'X-Ray Chest', 'IMAGING', '/uploads/admin_xray.pdf', 'UPLOADED', '2024-02-14');

COMMENT ON TABLE users IS 'Sample users: user@example.com, admin@example.com (password: password123)';
COMMENT ON TABLE reports IS 'Sample reports for testing';
