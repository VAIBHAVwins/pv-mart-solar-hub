
-- Create user roles enum
CREATE TYPE user_role AS ENUM ('admin', 'customer', 'vendor');

-- Create installation type enum
CREATE TYPE installation_type AS ENUM ('rooftop', 'ground_mounted', 'carport', 'other');

-- Create system type enum
CREATE TYPE system_type AS ENUM ('on_grid', 'off_grid', 'hybrid');

-- Create weather condition enum for game
CREATE TYPE weather_condition AS ENUM ('sunny', 'cloudy', 'rainy', 'stormy', 'night');

-- Create users table with both phone and email
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'customer',
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create OTP verification table
CREATE TABLE otp_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vendor_profiles table
CREATE TABLE vendor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company_name TEXT,
  contact_person TEXT,
  license_number TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customer_requirements table
CREATE TABLE customer_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  address TEXT NOT NULL,
  installation_type installation_type NOT NULL,
  system_type system_type NOT NULL,
  monthly_bill DECIMAL(10,2) NOT NULL,
  pincode TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vendor_quotations table
CREATE TABLE vendor_quotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES users(id) ON DELETE CASCADE,
  vendor_name TEXT NOT NULL,
  vendor_email TEXT NOT NULL,
  vendor_phone TEXT NOT NULL,
  installation_type installation_type NOT NULL,
  system_type system_type NOT NULL,
  total_price DECIMAL(12,2) NOT NULL,
  installation_charge DECIMAL(10,2),
  warranty_years INTEGER,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quotation_components table
CREATE TABLE quotation_components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id UUID REFERENCES vendor_quotations(id) ON DELETE CASCADE,
  component_name TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create hero_images table
CREATE TABLE hero_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  cta_text TEXT DEFAULT 'Learn More',
  cta_link TEXT DEFAULT '#',
  order_index INTEGER DEFAULT 0,
  display_duration INTEGER DEFAULT 5000,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blogs table
CREATE TABLE blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  author TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_pinned BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create game_scores table for solar game
CREATE TABLE game_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  energy_generated DECIMAL(10,2) NOT NULL,
  panels_placed INTEGER NOT NULL,
  game_duration INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_users table for magic link authentication
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert the first admin user
INSERT INTO admin_users (email) VALUES ('ankurvaibhav22@gmail.com');

-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotation_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update users" ON users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND role = 'admin'
    )
  );

-- Create RLS policies for OTP verifications
CREATE POLICY "Users can insert OTP verifications" ON otp_verifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own OTP verifications" ON otp_verifications
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own OTP verifications" ON otp_verifications
  FOR UPDATE USING (true);

-- Create RLS policies for other tables
CREATE POLICY "Vendors can view their own profile" ON vendor_profiles
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Admins can view all vendor profiles" ON vendor_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND role = 'admin'
    )
  );

CREATE POLICY "Customers can view their own requirements" ON customer_requirements
  FOR SELECT USING (auth.uid()::text = customer_id::text);

CREATE POLICY "Admins can view all requirements" ON customer_requirements
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND role = 'admin'
    )
  );

CREATE POLICY "Vendors can view their own quotations" ON vendor_quotations
  FOR SELECT USING (auth.uid()::text = vendor_id::text);

CREATE POLICY "Admins can view all quotations" ON vendor_quotations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND role = 'admin'
    )
  );

CREATE POLICY "Everyone can view active hero images" ON hero_images
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage hero images" ON hero_images
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = auth.email()
      AND is_active = true
    )
  );

CREATE POLICY "Everyone can view published blogs" ON blogs
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage blogs" ON blogs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = auth.email()
      AND is_active = true
    )
  );

CREATE POLICY "Users can view their own game scores" ON game_scores
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own game scores" ON game_scores
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Admins can manage admin users" ON admin_users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = auth.email()
      AND is_active = true
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_otp_verifications_phone ON otp_verifications(phone);
CREATE INDEX idx_otp_verifications_expires_at ON otp_verifications(expires_at);
CREATE INDEX idx_game_scores_user_id ON game_scores(user_id);
CREATE INDEX idx_game_scores_score ON game_scores(score DESC);
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_hero_images_order ON hero_images(order_index);
CREATE INDEX idx_blogs_status ON blogs(status);
CREATE INDEX idx_blogs_slug ON blogs(slug);

-- Insert some sample hero images
INSERT INTO hero_images (title, description, image_url, cta_text, cta_link, order_index, display_duration) VALUES
('Harness Solar Power', 'Transform your home with clean, renewable solar energy solutions', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&h=600&fit=crop', 'Get Quote', '/customer/requirement-form', 1, 6000),
('Expert Installation', 'Professional solar panel installation by certified technicians', 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=1200&h=600&fit=crop', 'Find Vendors', '/vendor/register', 2, 6000),
('Sustainable Future', 'Join thousands of customers saving money with solar energy', 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1200&h=600&fit=crop', 'Learn More', '/about', 3, 6000);

-- Insert some sample blogs
INSERT INTO blogs (title, slug, excerpt, content, category, tags, author, status, published_at) VALUES
('Benefits of Solar Energy', 'benefits-of-solar-energy', 'Discover the amazing benefits of switching to solar energy for your home and business.', 'Solar energy offers numerous benefits including reduced electricity bills, environmental protection, and energy independence. This renewable energy source is becoming increasingly popular as technology improves and costs decrease.', 'Education', ARRAY['solar', 'benefits', 'renewable'], 'PV Mart Team', 'published', NOW()),
('How Solar Panels Work', 'how-solar-panels-work', 'Learn about the technology behind solar panels and how they convert sunlight into electricity.', 'Solar panels work through the photovoltaic effect, converting sunlight directly into electricity. When photons from sunlight hit the solar cells, they knock electrons loose from atoms, generating an electric current.', 'Technology', ARRAY['solar', 'technology', 'education'], 'PV Mart Team', 'published', NOW()),
('Solar Installation Guide', 'solar-installation-guide', 'A comprehensive guide to solar panel installation for homeowners.', 'Installing solar panels involves several steps including site assessment, permits, equipment selection, and professional installation. This guide covers everything you need to know about the solar installation process.', 'Installation', ARRAY['installation', 'guide', 'homeowners'], 'PV Mart Team', 'published', NOW());
