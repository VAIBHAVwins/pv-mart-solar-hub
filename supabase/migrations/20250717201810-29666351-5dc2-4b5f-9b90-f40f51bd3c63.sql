
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
CREATE TYPE public.installation_type AS ENUM ('1KW', '2KW', '3KW', '4KW', '5KW', '6KW', '7KW', '8KW', '9KW', '10KW', 'custom');
CREATE TYPE public.system_type AS ENUM ('on-grid', 'off-grid', 'hybrid');
CREATE TYPE public.component_type AS ENUM ('solar_panel', 'inverter', 'battery', 'cable_ac', 'cable_dc', 'mounting_structure', 'earthing', 'lightning_arrestor', 'mc4_connector', 'junction_box', 'other');
CREATE TYPE public.requirement_status AS ENUM ('pending', 'active', 'completed', 'cancelled');
CREATE TYPE public.quotation_status AS ENUM ('draft', 'submitted', 'accepted', 'rejected');

-- Create main users table
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    company_name TEXT,
    contact_person TEXT,
    license_number TEXT,
    address TEXT,
    role TEXT NOT NULL CHECK (role IN ('vendor', 'customer', 'admin')),
    pm_surya_ghar_registered TEXT DEFAULT 'NO' CHECK (pm_surya_ghar_registered IN ('YES', 'NO')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Create customer requirements table (same structure as before)
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
    district TEXT,
    discom TEXT,
    property_type TEXT NOT NULL,
    roof_type TEXT NOT NULL,
    rooftop_area TEXT,
    monthly_bill NUMERIC,
    installation_type installation_type NOT NULL,
    system_type system_type NOT NULL,
    budget_range TEXT,
    timeline TEXT,
    additional_requirements TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Create vendor quotations table (same structure as before)
CREATE TABLE public.vendor_quotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    vendor_name TEXT NOT NULL,
    vendor_email TEXT NOT NULL,
    vendor_phone TEXT,
    installation_type installation_type NOT NULL,
    system_type system_type NOT NULL,
    total_price NUMERIC NOT NULL DEFAULT 0,
    installation_charge NUMERIC DEFAULT 0,
    warranty_years INTEGER DEFAULT 1,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Create quotation components table (same structure as before)
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

-- Create user_roles table for admin functionality
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'customer', 'vendor')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer functions
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = _user_id AND role = _role
  );
$$;

CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT role FROM public.users WHERE id = auth.uid() LIMIT 1;
$$;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can manage all users" ON public.users
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for customer_requirements (same as before)
CREATE POLICY "Customers can create their own requirements" ON public.customer_requirements
    FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Customers can view their own requirements" ON public.customer_requirements
    FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Customers can update their own requirements" ON public.customer_requirements
    FOR UPDATE USING (auth.uid() = customer_id);

CREATE POLICY "Customers can delete their own requirements" ON public.customer_requirements
    FOR DELETE USING (auth.uid() = customer_id);

CREATE POLICY "Vendors can view customer requirements" ON public.customer_requirements
    FOR SELECT USING (true);

-- RLS Policies for vendor_quotations (same as before)
CREATE POLICY "Vendors can create their own quotations" ON public.vendor_quotations
    FOR INSERT WITH CHECK (auth.uid() = vendor_id);

CREATE POLICY "Vendors can view their own quotations" ON public.vendor_quotations
    FOR SELECT USING (auth.uid() = vendor_id);

CREATE POLICY "Vendors can update their own quotations" ON public.vendor_quotations
    FOR UPDATE USING (auth.uid() = vendor_id);

CREATE POLICY "Vendors can delete their own quotations" ON public.vendor_quotations
    FOR DELETE USING (auth.uid() = vendor_id);

-- RLS Policies for quotation_components (same as before)
CREATE POLICY "Vendors can create quotation components" ON public.quotation_components
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.vendor_quotations 
            WHERE id = quotation_id AND vendor_id = auth.uid()
        )
    );

CREATE POLICY "Vendors can view their quotation components" ON public.quotation_components
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.vendor_quotations 
            WHERE id = quotation_id AND vendor_id = auth.uid()
        )
    );

CREATE POLICY "Vendors can update their quotation components" ON public.quotation_components
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.vendor_quotations 
            WHERE id = quotation_id AND vendor_id = auth.uid()
        )
    );

CREATE POLICY "Vendors can delete their quotation components" ON public.quotation_components
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.vendor_quotations 
            WHERE id = quotation_id AND vendor_id = auth.uid()
        )
    );

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
    FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all roles" ON public.user_roles
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger function for user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert into users table with metadata
  INSERT INTO public.users (
    id, email, full_name, phone, company_name, contact_person, 
    license_number, address, role, pm_surya_ghar_registered
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Unknown'),
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'company_name',
    NEW.raw_user_meta_data->>'contact_person',
    NEW.raw_user_meta_data->>'license_number',
    NEW.raw_user_meta_data->>'address',
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer'),
    COALESCE(NEW.raw_user_meta_data->>'pm_surya_ghar_registered', 'NO')
  );
  
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

CREATE TRIGGER update_customer_requirements_updated_at BEFORE UPDATE ON public.customer_requirements
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vendor_quotations_updated_at BEFORE UPDATE ON public.vendor_quotations
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_roles_updated_at BEFORE UPDATE ON public.user_roles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_customer_requirements_customer_id ON public.customer_requirements(customer_id);
CREATE INDEX idx_customer_requirements_status ON public.customer_requirements(status);
CREATE INDEX idx_vendor_quotations_vendor_id ON public.vendor_quotations(vendor_id);
CREATE INDEX idx_quotation_components_quotation_id ON public.quotation_components(quotation_id);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
