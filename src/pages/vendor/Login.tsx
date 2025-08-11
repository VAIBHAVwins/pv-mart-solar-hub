
import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { UnifiedLoginForm } from '@/components/auth/UnifiedLoginForm';
import { VendorRegistrationForm } from '@/components/auth/VendorRegistrationForm';
import { MobileOTPRegistration } from '@/components/auth/MobileOTPRegistration';

export default function VendorLogin() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showRegistration, setShowRegistration] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [verificationPhone, setVerificationPhone] = useState('');
  
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message);
    }
  }, [location]);

  const handleRegistrationSuccess = (phone: string) => {
    setVerificationPhone(phone);
    setShowRegistration(false);
    setShowOTPVerification(true);
  };

  const handleOTPVerificationComplete = () => {
    setShowOTPVerification(false);
    // Redirect to vendor dashboard
    window.location.href = '/vendor/dashboard';
  };

  const handleBackToLogin = () => {
    setShowRegistration(false);
    setShowOTPVerification(false);
  };

  if (showOTPVerification) {
    return (
      <Layout className="bg-gradient-to-br from-[#797a83] to-[#4f4f56] min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <MobileOTPRegistration
            phone={verificationPhone}
            userType="vendor"
            onVerificationComplete={handleOTPVerificationComplete}
            onBack={handleBackToLogin}
          />
        </div>
      </Layout>
    );
  }

  if (showRegistration) {
    return (
      <Layout className="bg-gradient-to-br from-[#797a83] to-[#4f4f56] min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <VendorRegistrationForm
              onOTPRequired={handleRegistrationSuccess}
              onBack={handleBackToLogin}
            />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout className="bg-gradient-to-br from-[#797a83] to-[#4f4f56] min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          {error && <div className="text-red-600 font-semibold text-center p-3 bg-red-100 rounded mb-4">{error}</div>}
          {success && <div className="text-green-600 font-semibold text-center p-3 bg-green-100 rounded mb-4">{success}</div>}
          
          <UnifiedLoginForm 
            userType="vendor"
            onRegisterClick={() => setShowRegistration(true)}
          />
          
          <div className="mt-6 text-center">
            <Link to="/" className="text-[#171a21] hover:underline">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
