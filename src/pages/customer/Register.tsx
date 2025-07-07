
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { OTPVerification } from '@/components/auth/OTPVerification';
import { RegistrationForm } from '@/components/customer/RegistrationForm';

export default function CustomerRegister() {
  const navigate = useNavigate();
  const [showOTP, setShowOTP] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const handleRegistrationSuccess = (email: string) => {
    setRegisteredEmail(email);
    setShowOTP(true);
  };

  const handleVerificationComplete = () => {
    navigate('/customer/dashboard');
  };

  const handleBackToRegistration = () => {
    setShowOTP(false);
    setRegisteredEmail('');
  };

  if (showOTP) {
    return (
      <Layout className="bg-gradient-to-br from-[#fecb00] to-[#f8b200] min-h-screen">
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
    <Layout className="bg-gradient-to-br from-[#fecb00] to-[#f8b200] min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <RegistrationForm onSuccess={handleRegistrationSuccess} />
      </div>
    </Layout>
  );
}
