
-- Add PM Surya Ghar registration field to vendors table
ALTER TABLE public.vendors 
ADD COLUMN IF NOT EXISTS pm_surya_ghar_registered boolean DEFAULT false;

-- Update existing vendors to have default value of false (NO)
UPDATE public.vendors 
SET pm_surya_ghar_registered = false 
WHERE pm_surya_ghar_registered IS NULL;

-- Make the column non-nullable after setting defaults
ALTER TABLE public.vendors 
ALTER COLUMN pm_surya_ghar_registered SET NOT NULL;
