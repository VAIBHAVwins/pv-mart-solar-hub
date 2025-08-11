
import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { VendorRegistrationForm } from '@/components/auth/VendorRegistrationForm';
import { OTPVerification } from '@/components/auth/OTPVerification';
import AuthMethodSelector from '@/components/auth/AuthMethodSelector';

export default function VendorLogin() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showRegistration, setShowRegistration] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [verificationPhone, setVerificationPhone] = useState('');
  const [showAuthSelector, setShowAuthSelector] = useState(true);
  
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message);
    }
  }, [location]);

  const handleAuthSuccess = () => {
    setSuccess('Login successful! Redirecting...');
    setTimeout(() => {
      window.location.href = '/vendor/dashboard';
    }, 1500);
  };

  const handleOTPRequired = (phone: string) => {
    setVerificationPhone(phone);
    setShowOTPVerification(true);
    setShowRegistration(false);
  };

  const handleOTPVerificationComplete = () => {
    setShowOTPVerification(false);
    handleAuthSuccess();
  };

  const handleBackToLogin = () => {
    setShowRegistration(false);
    setShowOTPVerification(false);
    setShowAuthSelector(true);
  };

  if (showOTPVerification) {
    return (
      <Layout className="bg-gradient-to-br from-[#797a83] to-[#4f4f56] min-h-screen">
        <OTPVerification
          phone={verificationPhone}
          onVerificationComplete={handleOTPVerificationComplete}
          onBack={handleBackToLogin}
        />
      </Layout>
    );
  }

  if (showRegistration) {
    return (
      <Layout className="bg-gradient-to-br from-[#797a83] to-[#4f4f56] min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <VendorRegistrationForm
              onOTPRequired={handleOTPRequired}
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
        <div className="max-w-md mx-auto bg-[#f7f7f6] rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#171a21] mb-2">Vendor Login</h1>
            <p className="text-[#4f4f56]">Access your business dashboard</p>
          </div>
          
          {error && <div className="text-red-600 font-semibold text-center p-3 bg-red-100 rounded mb-4">{error}</div>}
          {success && <div className="text-green-600 font-semibold text-center p-3 bg-green-100 rounded mb-4">{success}</div>}
          
          {showAuthSelector ? (
            <AuthMethodSelector 
              mode="login"
              userType="vendor"
              onSuccess={handleAuthSuccess}
            />
          ) : null}
          
          <div className="mt-6 text-center space-y-3">
            <button
              onClick={() => setShowRegistration(true)}
              className="text-[#4f4f56] hover:underline"
            >
              Don't have an account? Register here
            </button>
            <div>
              <Link to="/" className="text-[#171a21] hover:underline">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
