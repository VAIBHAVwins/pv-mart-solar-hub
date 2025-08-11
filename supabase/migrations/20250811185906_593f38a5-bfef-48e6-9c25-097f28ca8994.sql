
-- Add GST number column to users table for vendors
ALTER TABLE public.users 
ADD COLUMN gst_number text;

-- Add GST number column to vendor_profiles table as well for consistency
ALTER TABLE public.vendor_profiles 
ADD COLUMN gst_number text;
