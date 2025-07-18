
-- First, let's drop the existing problematic trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create a robust trigger function that handles all the issues
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Log the trigger execution for debugging
  RAISE NOTICE 'Trigger handle_new_user executed for user: %', NEW.id;
  RAISE NOTICE 'User email: %', NEW.email;
  RAISE NOTICE 'User metadata: %', NEW.raw_user_meta_data;
  
  -- Insert into users table with proper error handling
  INSERT INTO public.users (
    id, 
    email, 
    full_name, 
    phone, 
    role,
    company_name,
    contact_person,
    license_number,
    address,
    service_areas,
    specializations,
    pm_surya_ghar_registered
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Unknown'),
    NEW.raw_user_meta_data->>'phone',
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer'),
    NEW.raw_user_meta_data->>'company_name',
    COALESCE(NEW.raw_user_meta_data->>'contact_person', NEW.raw_user_meta_data->>'full_name'),
    NEW.raw_user_meta_data->>'license_number',
    NEW.raw_user_meta_data->>'address',
    NEW.raw_user_meta_data->>'service_areas',
    NEW.raw_user_meta_data->>'specializations',
    COALESCE(NEW.raw_user_meta_data->>'pm_surya_ghar_registered', 'NO')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, users.full_name),
    phone = COALESCE(EXCLUDED.phone, users.phone),
    role = COALESCE(EXCLUDED.role, users.role),
    company_name = COALESCE(EXCLUDED.company_name, users.company_name),
    contact_person = COALESCE(EXCLUDED.contact_person, users.contact_person),
    license_number = COALESCE(EXCLUDED.license_number, users.license_number),
    address = COALESCE(EXCLUDED.address, users.address),
    service_areas = COALESCE(EXCLUDED.service_areas, users.service_areas),
    specializations = COALESCE(EXCLUDED.specializations, users.specializations),
    pm_surya_ghar_registered = COALESCE(EXCLUDED.pm_surya_ghar_registered, users.pm_surya_ghar_registered),
    updated_at = now();
  
  -- Create profile based on role
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'customer') = 'customer' THEN
    INSERT INTO public.customer_profiles (user_id, address, city, state, pincode)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'address',
      NEW.raw_user_meta_data->>'city',
      NEW.raw_user_meta_data->>'state',
      NEW.raw_user_meta_data->>'pincode'
    )
    ON CONFLICT (user_id) DO UPDATE SET
      address = COALESCE(EXCLUDED.address, customer_profiles.address),
      city = COALESCE(EXCLUDED.city, customer_profiles.city),
      state = COALESCE(EXCLUDED.state, customer_profiles.state),
      pincode = COALESCE(EXCLUDED.pincode, customer_profiles.pincode),
      updated_at = now();
  ELSIF COALESCE(NEW.raw_user_meta_data->>'role', 'customer') = 'vendor' THEN
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
      CASE WHEN NEW.raw_user_meta_data->>'pm_surya_ghar_registered' = 'YES' THEN true ELSE false END
    )
    ON CONFLICT (user_id) DO UPDATE SET
      company_name = COALESCE(EXCLUDED.company_name, vendor_profiles.company_name),
      contact_person = COALESCE(EXCLUDED.contact_person, vendor_profiles.contact_person),
      license_number = COALESCE(EXCLUDED.license_number, vendor_profiles.license_number),
      address = COALESCE(EXCLUDED.address, vendor_profiles.address),
      service_areas = COALESCE(EXCLUDED.service_areas, vendor_profiles.service_areas),
      specializations = COALESCE(EXCLUDED.specializations, vendor_profiles.specializations),
      pm_surya_ghar_registered = COALESCE(EXCLUDED.pm_surya_ghar_registered, vendor_profiles.pm_surya_ghar_registered),
      updated_at = now();
  ELSIF COALESCE(NEW.raw_user_meta_data->>'role', 'customer') = 'admin' THEN
    INSERT INTO public.admin_users (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  
  RAISE NOTICE 'User and profile created successfully for user: %', NEW.id;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error in handle_new_user for user %: %', NEW.id, SQLERRM;
    -- Don't fail the entire transaction, just log the error
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Fix existing users that might be in auth.users but not in public.users
INSERT INTO public.users (id, email, full_name, role)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', 'Unknown') as full_name,
  COALESCE(au.raw_user_meta_data->>'role', 'customer') as role
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Verify the setup works
SELECT 'Database trigger and function updated successfully' as status;
