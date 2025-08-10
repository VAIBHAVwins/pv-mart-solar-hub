
-- Update the quotation_components table to match the application requirements
ALTER TABLE quotation_components 
ADD COLUMN component_type text,
ADD COLUMN specifications text,
ADD COLUMN included_length_meters numeric DEFAULT 0,
ADD COLUMN warranty_years integer DEFAULT 1;

-- Update existing data to use component_type instead of component_name
UPDATE quotation_components SET component_type = component_name WHERE component_type IS NULL;

-- Drop the old component_name column after migration
ALTER TABLE quotation_components DROP COLUMN component_name;

-- Make component_type required
ALTER TABLE quotation_components ALTER COLUMN component_type SET NOT NULL;

-- Add the first admin user (ankurvaibhav22@gmail.com)
INSERT INTO admin_users (email, is_active) 
VALUES ('ankurvaibhav22@gmail.com', true)
ON CONFLICT (email) DO UPDATE SET is_active = true;

-- Create a temporary game scores table for session-based high scores
CREATE TABLE IF NOT EXISTS temp_game_scores (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    score integer NOT NULL,
    energy_generated numeric NOT NULL,
    panels_placed integer NOT NULL,
    game_duration integer NOT NULL,
    session_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on temp_game_scores
ALTER TABLE temp_game_scores ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert and select temp game scores
CREATE POLICY "Anyone can insert temp game scores" ON temp_game_scores
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view temp game scores" ON temp_game_scores
    FOR SELECT USING (true);

-- Update users table to support mobile login
ALTER TABLE users ADD COLUMN password_hash text;

-- Create customer_profiles table
CREATE TABLE IF NOT EXISTS customer_profiles (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    first_name text,
    last_name text,
    address text,
    city text,
    state text,
    pincode text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own customer profile" ON customer_profiles
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own customer profile" ON customer_profiles
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Admins can view all customer profiles" ON customer_profiles
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM users 
        WHERE users.id::text = auth.uid()::text AND users.role = 'admin'
    ));
