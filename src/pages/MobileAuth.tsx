
import Layout from '@/components/layout/Layout';
import MobileOTPAuth from '@/components/auth/MobileOTPAuth';
import { useNavigate } from 'react-router-dom';

const MobileAuth = () => {
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    navigate('/customer/dashboard');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to PV Mart
            </h1>
            <p className="text-gray-600">
              Your trusted platform for solar energy solutions
            </p>
          </div>
          
          <MobileOTPAuth onSuccess={handleAuthSuccess} />
        </div>
      </div>
    </Layout>
  );
};

export default MobileAuth;
