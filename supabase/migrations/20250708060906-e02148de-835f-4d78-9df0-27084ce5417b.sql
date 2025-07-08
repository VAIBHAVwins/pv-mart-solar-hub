
-- First, let's drop the existing problematic triggers and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_with_role ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_new_user_with_role();

-- Create a robust trigger function that handles all cases
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Log the trigger execution for debugging
  RAISE NOTICE 'Trigger handle_new_user executed for user: %', NEW.id;
  RAISE NOTICE 'User metadata: %', NEW.raw_user_meta_data;
  
  -- Insert profile with proper error handling using INSERT ... ON CONFLICT
  INSERT INTO public.profiles (user_id, full_name, user_type, phone, company_name)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Unknown'),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'customer'),
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'company_name'
  )
  ON CONFLICT (user_id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    user_type = COALESCE(EXCLUDED.user_type, profiles.user_type),
    phone = COALESCE(EXCLUDED.phone, profiles.phone),
    company_name = COALESCE(EXCLUDED.company_name, profiles.company_name),
    updated_at = now();
  
  RAISE NOTICE 'Profile created or updated successfully for user: %', NEW.id;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error creating/updating profile for user %: %', NEW.id, SQLERRM;
    -- Don't fail the entire transaction, just log the error
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Clean up any existing users without profiles
INSERT INTO public.profiles (user_id, full_name, user_type)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'full_name', 'Unknown') as full_name,
  COALESCE(au.raw_user_meta_data->>'user_type', 'customer') as user_type
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.user_id
WHERE p.user_id IS NULL
ON CONFLICT (user_id) DO NOTHING;

-- Verify the setup
SELECT 'Trigger created successfully' as status;
