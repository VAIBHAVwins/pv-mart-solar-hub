
-- Drop existing tables first
DROP TABLE IF EXISTS vendor_quotations CASCADE;
DROP TABLE IF EXISTS vendor_profiles CASCADE;
DROP TABLE IF EXISTS quotation_components CASCADE;
DROP TABLE IF EXISTS customer_requirements CASCADE;
DROP TABLE IF EXISTS customer_profiles CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create enum types for better data integrity
CREATE TYPE user_role AS ENUM ('customer', 'vendor', 'admin');
CREATE TYPE installation_type AS ENUM ('rooftop', 'ground_mount', 'carport', 'other');
CREATE TYPE system_type AS ENUM ('on_grid', 'off_grid', 'hybrid');
CREATE TYPE requirement_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');

-- Create main users table
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    role user_role NOT NULL,
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Create customer profiles table
CREATE TABLE customer_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    address TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    UNIQUE(user_id)
);

-- Create vendor profiles table
CREATE TABLE vendor_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    license_number TEXT,
    address TEXT,
    service_areas TEXT,
    specializations TEXT,
    pm_surya_ghar_registered BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    UNIQUE(user_id)
);

-- Create customer requirements table
CREATE TABLE customer_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    property_type TEXT NOT NULL,
    roof_type TEXT NOT NULL,
    rooftop_area TEXT,
    monthly_bill NUMERIC,
    installation_type installation_type NOT NULL,
    system_type system_type NOT NULL,
    budget_range TEXT,
    timeline TEXT,
    additional_requirements TEXT,
    district TEXT,
    discom TEXT,
    status requirement_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Create vendor quotations table
CREATE TABLE vendor_quotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    customer_requirement_id UUID REFERENCES customer_requirements(id) ON DELETE SET NULL,
    vendor_name TEXT NOT NULL,
    vendor_email TEXT NOT NULL,
    vendor_phone TEXT,
    installation_type installation_type NOT NULL,
    system_type system_type NOT NULL,
    total_price NUMERIC NOT NULL DEFAULT 0,
    installation_charge NUMERIC DEFAULT 0,
    warranty_years INTEGER DEFAULT 1,
    description TEXT,
    status TEXT DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_quotations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for customer_profiles table
CREATE POLICY "Customers can manage their own profile" ON customer_profiles
    FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for vendor_profiles table
CREATE POLICY "Vendors can manage their own profile" ON vendor_profiles
    FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for customer_requirements table
CREATE POLICY "Customers can manage their own requirements" ON customer_requirements
    FOR ALL USING (auth.uid() = customer_id);

CREATE POLICY "Vendors can view all requirements" ON customer_requirements
    FOR SELECT USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'vendor'));

-- RLS Policies for vendor_quotations table
CREATE POLICY "Vendors can manage their own quotations" ON vendor_quotations
    FOR ALL USING (auth.uid() = vendor_id);

CREATE POLICY "Customers can view quotations for their requirements" ON vendor_quotations
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM customer_requirements cr 
        WHERE cr.id = customer_requirement_id AND cr.customer_id = auth.uid()
    ));

-- Create trigger function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert into users table
    INSERT INTO public.users (id, email, full_name, phone, role, email_verified)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Unknown'),
        NEW.raw_user_meta_data->>'phone',
        COALESCE(NEW.raw_user_meta_data->>'role', 'customer')::user_role,
        COALESCE(NEW.email_confirmed_at IS NOT NULL, false)
    );

    -- Create role-specific profile
    IF COALESCE(NEW.raw_user_meta_data->>'role', 'customer') = 'customer' THEN
        INSERT INTO public.customer_profiles (user_id, address, city, state, pincode)
        VALUES (
            NEW.id,
            NEW.raw_user_meta_data->>'address',
            NEW.raw_user_meta_data->>'city',
            NEW.raw_user_meta_data->>'state',
            NEW.raw_user_meta_data->>'pincode'
        );
    ELSIF NEW.raw_user_meta_data->>'role' = 'vendor' THEN
        INSERT INTO public.vendor_profiles (
            user_id, company_name, contact_person, license_number, 
            address, service_areas, specializations, pm_surya_ghar_registered
        )
        VALUES (
            NEW.id,
            NEW.raw_user_meta_data->>'company_name',
            COALESCE(NEW.raw_user_meta_data->>'contact_person', NEW.raw_user_meta_data->>'full_name'),
            NEW.raw_user_meta_data->>'license_number',
            NEW.raw_user_meta_data->>'address',
            NEW.raw_user_meta_data->>'service_areas',
            NEW.raw_user_meta_data->>'specializations',
            COALESCE((NEW.raw_user_meta_data->>'pm_surya_ghar_registered')::boolean, false)
        );
    END IF;

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error in handle_new_user: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create function to update email verification status
CREATE OR REPLACE FUNCTION update_user_email_verification()
RETURNS TRIGGER AS $$
BEGIN
    -- Update email_verified status when email is confirmed
    IF OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL THEN
        UPDATE public.users 
        SET email_verified = true, updated_at = now()
        WHERE id = NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for email verification
CREATE TRIGGER on_auth_user_email_confirmed
    AFTER UPDATE ON auth.users
    FOR EACH ROW 
    WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
    EXECUTE FUNCTION update_user_email_verification();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc', now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to all tables
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_profiles_updated_at
    BEFORE UPDATE ON customer_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendor_profiles_updated_at
    BEFORE UPDATE ON vendor_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_requirements_updated_at
    BEFORE UPDATE ON customer_requirements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendor_quotations_updated_at
    BEFORE UPDATE ON vendor_quotations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
