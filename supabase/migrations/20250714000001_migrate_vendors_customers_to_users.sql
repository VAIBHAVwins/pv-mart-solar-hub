-- Migration: Copy all vendors and customers into users table

-- Vendors
INSERT INTO users (id, email, full_name, phone, company_name, contact_person, license_number, address, role, created_at)
SELECT id, email, NULL, phone, company_name, contact_person, license_number, address, 'vendor', COALESCE(created_at, timezone('utc', now()))
FROM vendors
ON CONFLICT (id) DO NOTHING;

-- Customers
INSERT INTO users (id, email, full_name, phone, NULL, NULL, NULL, NULL, role, created_at)
SELECT id, email, full_name, phone, NULL, NULL, NULL, NULL, 'customer', COALESCE(created_at, timezone('utc', now()))
FROM customers
ON CONFLICT (id) DO NOTHING; 