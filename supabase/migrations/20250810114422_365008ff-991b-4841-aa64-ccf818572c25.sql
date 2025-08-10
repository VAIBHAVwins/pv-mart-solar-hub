
-- Add the admin user email to the admin_users table
INSERT INTO admin_users (email, is_active, created_at)
VALUES ('ankurvaibhav22@gmail.com', true, now())
ON CONFLICT (email) DO NOTHING;
