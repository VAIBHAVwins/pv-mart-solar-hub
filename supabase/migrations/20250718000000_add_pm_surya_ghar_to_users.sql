
-- Add pm_surya_ghar_registered column to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS pm_surya_ghar_registered TEXT DEFAULT 'NO';

-- Update existing vendor records to have 'NO' for this field
UPDATE public.users 
SET pm_surya_ghar_registered = 'NO' 
WHERE role = 'vendor' AND pm_surya_ghar_registered IS NULL;

-- Add a check constraint to ensure valid values
ALTER TABLE public.users 
ADD CONSTRAINT check_pm_surya_ghar_values 
CHECK (pm_surya_ghar_registered IN ('YES', 'NO'));
