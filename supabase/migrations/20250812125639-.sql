-- Fix critical security vulnerability in OTP tables
-- Drop overly permissive policies

-- Fix mobile_otp_verifications table policies
DROP POLICY IF EXISTS "Users can view their own OTP records" ON mobile_otp_verifications;
DROP POLICY IF EXISTS "Users can update OTP records" ON mobile_otp_verifications;

-- Create secure policies for mobile_otp_verifications
CREATE POLICY "Users can view their own mobile OTP records" ON mobile_otp_verifications
FOR SELECT USING (
  phone = (auth.jwt() ->> 'phone'::text) OR 
  is_admin()
);

CREATE POLICY "Users can update their own mobile OTP records" ON mobile_otp_verifications
FOR UPDATE USING (
  phone = (auth.jwt() ->> 'phone'::text) OR 
  is_admin()
);

-- Fix otp_verifications table policies  
DROP POLICY IF EXISTS "Users can view their own OTP verifications" ON otp_verifications;
DROP POLICY IF EXISTS "Users can update their own OTP verifications" ON otp_verifications;

-- The existing secure policies are sufficient:
-- "users_can_view_own_otp" and "admins_can_view_all_otp" already provide proper access control
-- "anyone_can_insert_otp" is needed for registration flow

-- Add missing UPDATE policy for otp_verifications with proper restrictions
CREATE POLICY "Users can update their own OTP verifications secure" ON otp_verifications
FOR UPDATE USING (
  phone = (auth.jwt() ->> 'phone'::text) OR 
  is_admin()
);