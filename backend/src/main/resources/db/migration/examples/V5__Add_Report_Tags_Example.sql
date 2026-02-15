-- ========================================
-- EXAMPLE MIGRATION: Add Report Tags
-- ========================================
-- Usage: Rename to V5__Add_Report_Tags.sql to use it

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    color VARCHAR(7) DEFAULT '#007bff',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE tags IS 'Tags for categorizing reports';
COMMENT ON COLUMN tags.color IS 'Hex color code for UI display';

-- Create junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS report_tags (
    report_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,
    PRIMARY KEY (report_id, tag_id),
    CONSTRAINT fk_report FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE,
    CONSTRAINT fk_tag FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

COMMENT ON TABLE report_tags IS 'Many-to-many relationship between reports and tags';

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_report_tags_report_id ON report_tags(report_id);
CREATE INDEX IF NOT EXISTS idx_report_tags_tag_id ON report_tags(tag_id);

-- Insert sample tags
INSERT INTO tags (name, color) VALUES
('Urgent', '#dc3545'),
('Routine', '#28a745'),
('Follow-up', '#ffc107')
ON CONFLICT (name) DO NOTHING;

-- Tag some sample reports
INSERT INTO report_tags (report_id, tag_id)
SELECT r.id, t.id FROM reports r CROSS JOIN tags t
WHERE r.id IN (1, 2) AND t.name IN ('Urgent', 'Follow-up')
ON CONFLICT DO NOTHING;
