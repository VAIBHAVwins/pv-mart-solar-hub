
-- Temporarily disable RLS for hero_images to allow admin operations
ALTER TABLE hero_images DISABLE ROW LEVEL SECURITY;

-- Also disable RLS for storage.objects to allow image uploads
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
