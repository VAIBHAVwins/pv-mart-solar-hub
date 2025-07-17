-- Migration: Create unified users table for vendors and customers
CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    phone TEXT,
    company_name TEXT,
    contact_person TEXT,
    license_number TEXT,
    address TEXT,
    role TEXT NOT NULL CHECK (role IN ('vendor', 'customer', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);
-- Index for sorting by creation time
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users (created_at); 