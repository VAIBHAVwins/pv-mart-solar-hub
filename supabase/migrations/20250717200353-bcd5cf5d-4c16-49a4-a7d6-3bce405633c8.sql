
-- Drop existing problematic tables and start fresh
DROP TABLE IF EXISTS public.quotation_components CASCADE;
DROP TABLE IF EXISTS public.vendor_quotations CASCADE;
DROP TABLE IF EXISTS public.customer_requirements CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;

-- Drop existing functions and triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_with_role ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_new_user_with_role();
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role);
DROP FUNCTION IF EXISTS public.get_current_user_role();

-- Drop existing types
DROP TYPE IF EXISTS public.app_role CASCADE;
DROP TYPE IF EXISTS public.installation_type CASCADE;
DROP TYPE IF EXISTS public.system_type CASCADE;
DROP TYPE IF EXISTS public.component_type CASCADE;

-- Create clean enums
CREATE TYPE public.user_role AS ENUM ('customer', 'vendor', 'admin');
CREATE TYPE public.installation_type AS ENUM ('on_grid', 'off_grid', 'hybrid');
CREATE TYPE public.system_type AS ENUM ('residential', 'commercial', 'industrial');
CREATE TYPE public.component_type AS ENUM ('solar_panel', 'inverter', 'battery', 'mounting_structure', 'cables', 'other');
CREATE TYPE public.requirement_status AS ENUM ('pending', 'active', 'completed', 'cancelled');
CREATE TYPE public.quotation_status AS ENUM ('draft', 'submitted', 'accepted', 'rejected');

-- Create main users table
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    role user_role NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Create customer profiles table
CREATE TABLE public.customer_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    address TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Create vendor profiles table
CREATE TABLE public.vendor_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    license_number TEXT,
    address TEXT,
    service_areas TEXT,
    specializations TEXT,
    pm_surya_ghar_registered BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Create customer requirements table
CREATE TABLE public.customer_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
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
CREATE TABLE public.vendor_quotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    customer_requirement_id UUID REFERENCES public.customer_requirements(id) ON DELETE SET NULL,
    vendor_name TEXT NOT NULL,
    vendor_email TEXT NOT NULL,
    vendor_phone TEXT,
    installation_type installation_type NOT NULL,
    system_type system_type NOT NULL,
    total_price NUMERIC NOT NULL DEFAULT 0,
    installation_charge NUMERIC DEFAULT 0,
    warranty_years INTEGER DEFAULT 1,
    description TEXT,
    status quotation_status DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Create quotation components table
CREATE TABLE public.quotation_components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quotation_id UUID NOT NULL REFERENCES public.vendor_quotations(id) ON DELETE CASCADE,
    component_type component_type NOT NULL,
    brand TEXT NOT NULL,
    model TEXT,
    specifications TEXT,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price NUMERIC NOT NULL,
    total_price NUMERIC NOT NULL,
    warranty_years INTEGER,
    included_length_meters INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Create admin users table for additional admin controls
CREATE TABLE public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    permissions TEXT[] DEFAULT ARRAY['manage_users', 'manage_content'],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create security definer functions
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = user_uuid AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_vendor(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = user_uuid AND role = 'vendor'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_customer(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = user_uuid AND role = 'customer'
  );
$$;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (public.is_admin());

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can manage all users" ON public.users
    FOR ALL USING (public.is_admin());

-- RLS Policies for customer_profiles
CREATE POLICY "Customers can manage their own profile" ON public.customer_profiles
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all customer profiles" ON public.customer_profiles
    FOR SELECT USING (public.is_admin());

-- RLS Policies for vendor_profiles
CREATE POLICY "Vendors can manage their own profile" ON public.vendor_profiles
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all vendor profiles" ON public.vendor_profiles
    FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can update vendor verification" ON public.vendor_profiles
    FOR UPDATE USING (public.is_admin());

-- RLS Policies for customer_requirements
CREATE POLICY "Customers can manage their own requirements" ON public.customer_requirements
    FOR ALL USING (auth.uid() = customer_id);

CREATE POLICY "Vendors can view all requirements" ON public.customer_requirements
    FOR SELECT USING (public.is_vendor());

CREATE POLICY "Admins can manage all requirements" ON public.customer_requirements
    FOR ALL USING (public.is_admin());

-- RLS Policies for vendor_quotations
CREATE POLICY "Vendors can manage their own quotations" ON public.vendor_quotations
    FOR ALL USING (auth.uid() = vendor_id);

CREATE POLICY "Customers can view quotations for their requirements" ON public.vendor_quotations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.customer_requirements 
            WHERE id = customer_requirement_id AND customer_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage all quotations" ON public.vendor_quotations
    FOR ALL USING (public.is_admin());

-- RLS Policies for quotation_components
CREATE POLICY "Vendors can manage their quotation components" ON public.quotation_components
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.vendor_quotations 
            WHERE id = quotation_id AND vendor_id = auth.uid()
        )
    );

CREATE POLICY "Customers can view components for their quotations" ON public.quotation_components
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.vendor_quotations vq
            JOIN public.customer_requirements cr ON vq.customer_requirement_id = cr.id
            WHERE vq.id = quotation_id AND cr.customer_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage all quotation components" ON public.quotation_components
    FOR ALL USING (public.is_admin());

-- RLS Policies for admin_users
CREATE POLICY "Admins can view admin users" ON public.admin_users
    FOR SELECT USING (public.is_admin());

CREATE POLICY "Super admins can manage admin users" ON public.admin_users
    FOR ALL USING (public.is_admin());

-- Create trigger function for user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_role_from_metadata TEXT;
BEGIN
    -- Get role from metadata
    user_role_from_metadata := COALESCE(NEW.raw_user_meta_data->>'role', 'customer');
    
    -- Insert into users table
    INSERT INTO public.users (id, email, full_name, phone, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Unknown'),
        NEW.raw_user_meta_data->>'phone',
        user_role_from_metadata::user_role
    );
    
    -- Create profile based on role
    IF user_role_from_metadata = 'customer' THEN
        INSERT INTO public.customer_profiles (user_id, address, city, state, pincode)
        VALUES (
            NEW.id,
            NEW.raw_user_meta_data->>'address',
            NEW.raw_user_meta_data->>'city',
            NEW.raw_user_meta_data->>'state',
            NEW.raw_user_meta_data->>'pincode'
        );
    ELSIF user_role_from_metadata = 'vendor' THEN
        INSERT INTO public.vendor_profiles (
            user_id, company_name, contact_person, license_number, 
            address, service_areas, specializations, pm_surya_ghar_registered
        )
        VALUES (
            NEW.id,
            NEW.raw_user_meta_data->>'company_name',
            COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'contact_person'),
            NEW.raw_user_meta_data->>'license_number',
            NEW.raw_user_meta_data->>'address',
            NEW.raw_user_meta_data->>'service_areas',
            NEW.raw_user_meta_data->>'specializations',
            COALESCE((NEW.raw_user_meta_data->>'pm_surya_ghar_registered')::boolean, false)
        );
    ELSIF user_role_from_metadata = 'admin' THEN
        INSERT INTO public.admin_users (user_id)
        VALUES (NEW.id);
    END IF;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error in handle_new_user: %', SQLERRM;
        RETURN NEW;
END;
$$;

-- Create trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create update trigger for updated_at columns
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc', now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customer_profiles_updated_at BEFORE UPDATE ON public.customer_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vendor_profiles_updated_at BEFORE UPDATE ON public.vendor_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customer_requirements_updated_at BEFORE UPDATE ON public.customer_requirements
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vendor_quotations_updated_at BEFORE UPDATE ON public.vendor_quotations
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_customer_profiles_user_id ON public.customer_profiles(user_id);
CREATE INDEX idx_vendor_profiles_user_id ON public.vendor_profiles(user_id);
CREATE INDEX idx_customer_requirements_customer_id ON public.customer_requirements(customer_id);
CREATE INDEX idx_customer_requirements_status ON public.customer_requirements(status);
CREATE INDEX idx_vendor_quotations_vendor_id ON public.vendor_quotations(vendor_id);
CREATE INDEX idx_vendor_quotations_customer_requirement_id ON public.vendor_quotations(customer_requirement_id);
CREATE INDEX idx_quotation_components_quotation_id ON public.quotation_components(quotation_id);
