
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { UnifiedLoginForm } from '@/components/auth/UnifiedLoginForm';
import { VendorRegistrationForm } from '@/components/auth/VendorRegistrationForm';
import { MobileOTPRegistration } from '@/components/auth/MobileOTPRegistration';
import { RegistrationSuccessPopup } from '@/components/auth/RegistrationSuccessPopup';

const VendorLogin = () => {
  const [currentView, setCurrentView] = useState<'login' | 'register' | 'otp' | 'success'>('login');
  const [registrationPhone, setRegistrationPhone] = useState('');

  const handleRegisterClick = () => {
    setCurrentView('register');
  };

  const handleBackToLogin = () => {
    setCurrentView('login');
    setRegistrationPhone('');
  };

  const handleOTPRequired = (phone: string) => {
    setRegistrationPhone(phone);
    setCurrentView('otp');
  };

  const handleVerificationComplete = () => {
    setCurrentView('success');
  };

  const handleRedirectToDashboard = () => {
    window.location.href = '/vendor/dashboard';
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        {currentView === 'login' && (
          <UnifiedLoginForm 
            userType="vendor" 
            onRegisterClick={handleRegisterClick}
          />
        )}
        
        {currentView === 'register' && (
          <VendorRegistrationForm 
            onOTPRequired={handleOTPRequired}
            onBack={handleBackToLogin}
          />
        )}
        
        {currentView === 'otp' && (
          <MobileOTPRegistration 
            phone={registrationPhone}
            userType="vendor"
            onVerificationComplete={handleVerificationComplete}
            onBack={() => setCurrentView('register')}
          />
        )}
        
        {currentView === 'success' && (
          <RegistrationSuccessPopup 
            userType="vendor"
            onRedirect={handleRedirectToDashboard}
          />
        )}
      </div>
    </Layout>
  );
};

export default VendorLogin;
