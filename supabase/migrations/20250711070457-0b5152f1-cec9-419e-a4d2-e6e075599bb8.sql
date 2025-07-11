
-- Create hero_images table with proper structure
CREATE TABLE IF NOT EXISTS public.hero_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  cta_text TEXT DEFAULT 'Learn More',
  cta_link TEXT DEFAULT '#',
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hero_images_order ON public.hero_images(order_index);
CREATE INDEX IF NOT EXISTS idx_hero_images_active ON public.hero_images(is_active);

-- Enable Row Level Security
ALTER TABLE public.hero_images ENABLE ROW LEVEL SECURITY;

-- Create policies for hero_images
CREATE POLICY "Anyone can view active hero images" ON public.hero_images
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage all hero images" ON public.hero_images
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_hero_images_updated_at 
  BEFORE UPDATE ON public.hero_images 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default hero images
INSERT INTO public.hero_images (title, description, image_url, cta_text, cta_link, order_index, is_active) VALUES
  ('PM-KUSUM Yojana 2024', 'Transform your energy future with government-backed solar solutions. Save money while contributing to a sustainable tomorrow.', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&h=600&fit=crop', 'Learn More', '/about', 1, true),
  ('Zero Down Payment', 'No upfront costs required. Choose from flexible payment plans and start saving on your electricity bills immediately.', 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=1200&h=600&fit=crop', 'Get Quote', '/installation-type', 2, true),
  ('Free Site Assessment', 'Our experts analyze your location, energy consumption, and roof structure to design the perfect solar solution for your needs.', 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=1200&q=80', 'Book Assessment', '/contact', 3, true)
ON CONFLICT (id) DO NOTHING;

-- Create admin user if not exists and assign admin role
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Check if admin user exists
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'ecogrid.ai@gmail.com';
  
  -- If admin user exists, ensure they have admin role
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;
