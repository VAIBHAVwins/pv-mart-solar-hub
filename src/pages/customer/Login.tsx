
import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { UnifiedLoginForm } from '@/components/auth/UnifiedLoginForm';
import { CustomerRegistrationForm } from '@/components/auth/CustomerRegistrationForm';
import { MobileOTPRegistration } from '@/components/auth/MobileOTPRegistration';

export default function CustomerLogin() {
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
    // Redirect to customer dashboard
    window.location.href = '/customer/dashboard';
  };

  const handleBackToLogin = () => {
    setShowRegistration(false);
    setShowOTPVerification(false);
  };

  if (showOTPVerification) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center bg-jonquil py-16 px-4">
          <MobileOTPRegistration
            phone={verificationPhone}
            userType="customer"
            onVerificationComplete={handleOTPVerificationComplete}
            onBack={handleBackToLogin}
          />
        </div>
      </Layout>
    );
  }

  if (showRegistration) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center bg-jonquil py-16 px-4">
          <CustomerRegistrationForm 
            onOTPRequired={handleRegistrationSuccess}
            onBack={handleBackToLogin}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-jonquil py-16 px-4">
        {error && <div className="text-red-600 font-semibold text-center p-3 bg-red-50 rounded mb-4">{error}</div>}
        {success && <div className="text-green-600 font-semibold text-center p-3 bg-green-50 rounded mb-4">{success}</div>}
        
        <UnifiedLoginForm 
          userType="customer"
          onRegisterClick={() => setShowRegistration(true)}
        />
        
        <div className="mt-6 text-center">
          <Link to="/" className="text-licorice hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </Layout>
  );
}
