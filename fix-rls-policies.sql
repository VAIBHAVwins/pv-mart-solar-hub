-- Fix RLS policies for hero_images table
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON hero_images;
DROP POLICY IF EXISTS "Anyone can view active hero images" ON hero_images;
DROP POLICY IF EXISTS "Admins can manage all hero images" ON hero_images;

-- Create new simplified policies that work with local development
CREATE POLICY "Enable read access for all users" ON hero_images
FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON hero_images
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON hero_images
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON hero_images
FOR DELETE USING (auth.role() = 'authenticated');

-- Fix storage policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete" ON storage.objects;

-- Create simplified storage policies
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'hero-images');

CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'hero-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'hero-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete" ON storage.objects
FOR DELETE USING (
  bucket_id = 'hero-images' 
  AND auth.role() = 'authenticated'
); 