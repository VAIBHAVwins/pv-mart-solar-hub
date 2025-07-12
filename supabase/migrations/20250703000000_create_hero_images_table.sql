-- Create hero_images table for homepage banners
CREATE TABLE IF NOT EXISTS hero_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE hero_images ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all users to select (for testing, you can restrict later)
CREATE POLICY "Allow all select" ON hero_images
  FOR SELECT
  USING (true);

-- Policy: Allow admin to insert/update/delete (optional, for future admin UI)
CREATE POLICY "Admins can modify banners" ON hero_images
  FOR ALL
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for updated_at
DROP TRIGGER IF EXISTS set_updated_at_hero_images ON hero_images;
CREATE TRIGGER set_updated_at_hero_images
BEFORE UPDATE ON hero_images
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column(); 