
-- Add missing columns to users table for vendor information
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS company_name TEXT,
ADD COLUMN IF NOT EXISTS contact_person TEXT,
ADD COLUMN IF NOT EXISTS license_number TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS service_areas TEXT,
ADD COLUMN IF NOT EXISTS specializations TEXT,
ADD COLUMN IF NOT EXISTS pm_surya_ghar_registered BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;

-- Update existing vendor users with data from vendor_profiles
UPDATE users 
SET 
  company_name = vp.company_name,
  contact_person = vp.contact_person,
  license_number = vp.license_number,
  address = vp.address,
  service_areas = vp.service_areas,
  specializations = vp.specializations,
  pm_surya_ghar_registered = vp.pm_surya_ghar_registered,
  is_verified = vp.is_verified
FROM vendor_profiles vp
WHERE users.id = vp.user_id AND users.role = 'vendor';

-- Update the handle_new_user function to populate these fields for new vendors
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_role_from_metadata TEXT;
BEGIN
    -- Get role from metadata
    user_role_from_metadata := COALESCE(NEW.raw_user_meta_data->>'role', 'customer');
    
    -- Insert into users table with all relevant fields
    INSERT INTO public.users (
        id, email, full_name, phone, role,
        company_name, contact_person, license_number, address, 
        service_areas, specializations, pm_surya_ghar_registered
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Unknown'),
        NEW.raw_user_meta_data->>'phone',
        user_role_from_metadata::user_role,
        NEW.raw_user_meta_data->>'company_name',
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'contact_person'),
        NEW.raw_user_meta_data->>'license_number',
        NEW.raw_user_meta_data->>'address',
        NEW.raw_user_meta_data->>'service_areas',
        NEW.raw_user_meta_data->>'specializations',
        COALESCE((NEW.raw_user_meta_data->>'pm_surya_ghar_registered')::boolean, false)
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
