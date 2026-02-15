-- Migration V2: Create Reports Table
-- Report Management System

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

-- Create indexes for better query performance
CREATE INDEX idx_reports_user_id ON reports(user_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);

COMMENT ON TABLE reports IS 'Medical reports uploaded by users';
COMMENT ON COLUMN reports.id IS 'Unique report identifier';
COMMENT ON COLUMN reports.user_id IS 'Foreign key to users table';
COMMENT ON COLUMN reports.name IS 'Report name';
COMMENT ON COLUMN reports.type IS 'Report type (LAB_REPORT, IMAGING, etc.)';
COMMENT ON COLUMN reports.file_path IS 'Path to uploaded file';
COMMENT ON COLUMN reports.status IS 'Report status (UPLOADED, PROCESSING, COMPLETED)';
COMMENT ON COLUMN reports.summary IS 'Generated report summary';
COMMENT ON COLUMN reports.report_date IS 'Date of the medical report';
COMMENT ON COLUMN reports.created_at IS 'Upload timestamp';
COMMENT ON COLUMN reports.updated_at IS 'Last update timestamp';
