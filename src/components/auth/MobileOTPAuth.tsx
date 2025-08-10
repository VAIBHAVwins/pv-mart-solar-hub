
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import PhoneAuthForm from './PhoneAuthForm';
import OTPInput from './OTPInput';

interface MobileOTPAuthProps {
  onSuccess: () => void;
}

const MobileOTPAuth = ({ onSuccess }: MobileOTPAuthProps) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendOTP = async (phone: string) => {
    setLoading(true);
    setError('');

    try {
      const fullPhoneNumber = `+91${phone}`;
      const otpCode = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Store OTP in database
      const { error: otpError } = await supabase
        .from('otp_verifications')
        .insert({
          phone: fullPhoneNumber,
          otp_code: otpCode,
          expires_at: expiresAt.toISOString()
        });

      if (otpError) throw otpError;

      // In a real app, you would send SMS here
      // For demo purposes, we'll show the OTP in console/alert
      console.log(`OTP for ${fullPhoneNumber}: ${otpCode}`);
      alert(`Demo Mode: Your OTP is ${otpCode}`);

      setPhoneNumber(fullPhoneNumber);
      setStep('otp');
    } catch (err: any) {
      console.error('Error sending OTP:', err);
      setError('Failed to send verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (otpCode: string) => {
    setLoading(true);
    setError('');

    try {
      // Verify OTP
      const { data: otpData, error: otpError } = await supabase
        .from('otp_verifications')
        .select('*')
        .eq('phone', phoneNumber)
        .eq('otp_code', otpCode)
        .eq('is_used', false)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (otpError || !otpData) {
        setError('Invalid or expired verification code');
        return;
      }

      // Mark OTP as used
      await supabase
        .from('otp_verifications')
        .update({ is_used: true })
        .eq('id', otpData.id);

      // Check if user exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('phone', phoneNumber)
        .single();

      if (!existingUser) {
        // Create new user
        const { error: userError } = await supabase
          .from('users')
          .insert({
            phone: phoneNumber,
            is_verified: true
          });

        if (userError) throw userError;
      } else {
        // Update verification status
        await supabase
          .from('users')
          .update({ is_verified: true })
          .eq('phone', phoneNumber);
      }

      onSuccess();
    } catch (err: any) {
      console.error('Error verifying OTP:', err);
      setError('Failed to verify code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'otp') {
    return (
      <OTPInput
        phoneNumber={phoneNumber}
        onVerifyOTP={verifyOTP}
        onBackToPhone={() => setStep('phone')}
        loading={loading}
        error={error}
      />
    );
  }

  return (
    <PhoneAuthForm
      onSendOTP={sendOTP}
      loading={loading}
      error={error}
    />
  );
};

export default MobileOTPAuth;
