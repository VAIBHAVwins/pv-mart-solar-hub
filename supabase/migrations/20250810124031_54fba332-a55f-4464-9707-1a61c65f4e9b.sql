
-- Add the new admin user to admin_users table
INSERT INTO public.admin_users (email, is_active) 
VALUES ('ttemp604@yahoo.com', true)
ON CONFLICT (email) DO NOTHING;

-- Also ensure the existing admin user is in the table
INSERT INTO public.admin_users (email, is_active) 
VALUES ('ankurvaibhav22@gmail.com', true)
ON CONFLICT (email) DO NOTHING;
