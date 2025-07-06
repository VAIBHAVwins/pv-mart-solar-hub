
-- Add missing columns to customer_requirements table
ALTER TABLE public.customer_requirements 
ADD COLUMN IF NOT EXISTS rooftop_area TEXT,
ADD COLUMN IF NOT EXISTS district TEXT,
ADD COLUMN IF NOT EXISTS discom TEXT;

-- Update the profiles trigger to handle errors better and include phone
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Log the trigger execution for debugging
  RAISE NOTICE 'Trigger handle_new_user executed for user: %', NEW.id;
  RAISE NOTICE 'User metadata: %', NEW.raw_user_meta_data;
  
  -- Insert profile with proper error handling
  INSERT INTO public.profiles (user_id, full_name, user_type, phone)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Unknown'),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'customer'),
    NEW.raw_user_meta_data->>'phone'
  );
  
  RAISE NOTICE 'Profile created successfully for user: %', NEW.id;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
