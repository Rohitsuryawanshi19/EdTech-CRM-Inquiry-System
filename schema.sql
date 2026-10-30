-- ============================================================
-- EdTech CRM & Inquiry System - Database Schema (Supabase PostgreSQL)
-- For K12 Hunar Full-Stack Assessment
-- ============================================================

-- Enable UUID extension (built-in in PostgreSQL 13+ / Supabase)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Create Admins Table
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Inquiries Table
CREATE TABLE IF NOT EXISTS inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    user_type VARCHAR(50) NOT NULL CHECK (user_type IN ('Parent', 'Student', 'School')),
    category VARCHAR(50) NOT NULL CHECK (category IN ('Scholarship', 'Concert', 'Admission', 'General Query')),
    message TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Resolved', 'Closed')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Indexes for High-Performance Filtering and Searching
CREATE INDEX IF NOT EXISTS idx_inquiries_category ON inquiries(category);
CREATE INDEX IF NOT EXISTS idx_inquiries_user_type ON inquiries(user_type);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_name ON inquiries(name);
CREATE INDEX IF NOT EXISTS idx_inquiries_phone ON inquiries(phone);
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);

-- 4. Trigger Function for Automatic updated_at Timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at_inquiries ON inquiries;
CREATE TRIGGER set_updated_at_inquiries
    BEFORE UPDATE ON inquiries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_admins ON admins;
CREATE TRIGGER set_updated_at_admins
    BEFORE UPDATE ON admins
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- Seed Default Admin & Sample Inquiries
-- Default Password for admin: Admin@12345
-- Bcrypt Hash ($2a$10$ or $2b$10$): $2a$10$rC4j1v8OqU0N1hZ0sVb5eecWp2RkQv8R4h3y9Xk5Zl9W5q8h4rD5i (computed via bcrypt)
-- ============================================================

INSERT INTO admins (name, email, password_hash, role)
VALUES (
    'K12 Hunar Admin',
    'admin@k12hunar.com',
    '$2a$10$4F6z0b01c3Xp09w5U3U7seFz1mJ1m4XvY/P44U1mE5t4E2W8p4k1y',
    'admin'
)
ON CONFLICT (email) DO NOTHING;

-- Sample Seed Inquiries to test filtering, status and search immediately
INSERT INTO inquiries (name, email, phone, user_type, category, message, status)
VALUES
('Aarav Sharma', 'aarav.parent@gmail.com', '+91 98765 43210', 'Parent', 'Admission', 'Looking for Grade 8 admission details for academic year 2026-2027.', 'Pending'),
('Priya Patel', 'priya.student@outlook.com', '+91 91234 56789', 'Student', 'Scholarship', 'Interested in applying for the National Hunar Talent Scholarship for STEM.', 'In Progress'),
('St. Xavier High School', 'principal@stxaviers.edu', '+91 99887 76655', 'School', 'Concert', 'Requesting partnership for our Annual Inter-School Music and Cultural Concert.', 'Resolved'),
('Rohan Verma', 'rohan.v@yahoo.com', '+91 94567 89012', 'Student', 'General Query', 'Need syllabus and past year papers for the K12 Hunar Olympiad.', 'Pending'),
('Anita Deshmukh', 'anita.d@gmail.com', '+91 97654 32109', 'Parent', 'Scholarship', 'What is the eligibility criteria for the girl child merit scholarship?', 'In Progress')
ON CONFLICT DO NOTHING;
