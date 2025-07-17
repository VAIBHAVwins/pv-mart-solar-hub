
import Layout from '@/components/layout/Layout';
import { useState } from 'react';
import { OTPVerification } from '@/components/auth/OTPVerification';
import { VendorRegistrationForm } from '@/components/vendor/VendorRegistrationForm';
import { Link } from 'react-router-dom';

const VendorRegister = () => {
  const [showOTP, setShowOTP] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const handleRegistrationSuccess = (email: string) => {
    console.log('✅ Vendor registration success, showing OTP for:', email);
    setRegisteredEmail(email);
    setShowOTP(true);
  };

  const handleVerificationComplete = () => {
    console.log('✅ Email verification complete, redirecting to dashboard');
    window.location.href = '/vendor/dashboard';
  };

  const handleBackToRegistration = () => {
    console.log('🔄 Going back to registration form');
    setShowOTP(false);
    setRegisteredEmail('');
  };

  if (showOTP) {
    return (
      <Layout className="bg-gradient-to-br from-[#e6d3b3] to-[#b07e66] min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <OTPVerification
            email={registeredEmail}
            onVerificationComplete={handleVerificationComplete}
            onBack={handleBackToRegistration}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7f7f6] py-16 px-4">
        <VendorRegistrationForm onSuccess={handleRegistrationSuccess} />
        <div className="mt-6 text-center">
          <p className="text-[#4f4f56] mb-2">
            Already have an account?{' '}
            <Link to="/vendor/login" className="text-[#797a83] hover:underline font-semibold">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default VendorRegister;
