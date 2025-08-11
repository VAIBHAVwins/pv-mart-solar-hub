
-- Create a unified OTP verification table for mobile number verification
CREATE TABLE IF NOT EXISTS public.mobile_otp_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('customer', 'vendor')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.mobile_otp_verifications ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert OTP records
CREATE POLICY "Anyone can create OTP verifications" ON public.mobile_otp_verifications
  FOR INSERT WITH CHECK (TRUE);

-- Allow users to view their own OTP records
CREATE POLICY "Users can view their own OTP records" ON public.mobile_otp_verifications
  FOR SELECT USING (TRUE);

-- Allow users to update their own OTP records
CREATE POLICY "Users can update OTP records" ON public.mobile_otp_verifications
  FOR UPDATE USING (TRUE);

-- Create function to generate 6-digit OTP
CREATE OR REPLACE FUNCTION generate_mobile_otp()
RETURNS TEXT AS $$
BEGIN
  RETURN LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Create function to send mobile OTP
CREATE OR REPLACE FUNCTION send_mobile_otp(phone_number TEXT, user_type TEXT)
RETURNS TEXT AS $$
DECLARE
  otp_code TEXT;
  normalized_phone TEXT;
BEGIN
  -- Normalize phone number (remove spaces, add +91 if needed)
  normalized_phone := REGEXP_REPLACE(phone_number, '[^0-9+]', '', 'g');
  IF NOT normalized_phone LIKE '+91%' AND LENGTH(normalized_phone) = 10 THEN
    normalized_phone := '+91' || normalized_phone;
  END IF;
  
  -- Generate OTP
  otp_code := generate_mobile_otp();
  
  -- Insert OTP record (expires in 10 minutes)
  INSERT INTO public.mobile_otp_verifications (phone, otp_code, user_type, expires_at)
  VALUES (normalized_phone, otp_code, user_type, NOW() + INTERVAL '10 minutes');
  
  -- In production, you would send SMS here
  -- For demo, we'll return the OTP
  RETURN otp_code;
END;
$$ LANGUAGE plpgsql;

-- Create function to verify mobile OTP
CREATE OR REPLACE FUNCTION verify_mobile_otp(phone_number TEXT, otp_code TEXT, user_type TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  normalized_phone TEXT;
  otp_record RECORD;
BEGIN
  -- Normalize phone number
  normalized_phone := REGEXP_REPLACE(phone_number, '[^0-9+]', '', 'g');
  IF NOT normalized_phone LIKE '+91%' AND LENGTH(normalized_phone) = 10 THEN
    normalized_phone := '+91' || normalized_phone;
  END IF;
  
  -- Find valid OTP
  SELECT * INTO otp_record 
  FROM public.mobile_otp_verifications 
  WHERE phone = normalized_phone 
    AND otp_code = otp_code 
    AND user_type = user_type
    AND expires_at > NOW() 
    AND is_used = FALSE
  ORDER BY created_at DESC 
  LIMIT 1;
  
  IF otp_record.id IS NOT NULL THEN
    -- Mark OTP as used
    UPDATE public.mobile_otp_verifications 
    SET is_used = TRUE 
    WHERE id = otp_record.id;
    
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Update users table to include PM Surya Ghar registration status for vendors
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS pm_surya_ghar_registered BOOLEAN DEFAULT FALSE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS company_name TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS contact_person TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS vendor_name TEXT;

-- Create function to normalize phone numbers
CREATE OR REPLACE FUNCTION normalize_phone(phone_input TEXT)
RETURNS TEXT AS $$
BEGIN
  IF phone_input IS NULL OR phone_input = '' THEN
    RETURN '';
  END IF;
  
  -- Remove all non-digits and + signs
  phone_input := REGEXP_REPLACE(phone_input, '[^0-9+]', '', 'g');
  
  -- Add +91 if it's a 10-digit number
  IF LENGTH(phone_input) = 10 AND phone_input ~ '^[6-9][0-9]{9}$' THEN
    RETURN '+91' || phone_input;
  END IF;
  
  RETURN phone_input;
END;
$$ LANGUAGE plpgsql;
