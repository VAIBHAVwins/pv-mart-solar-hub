
import Layout from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { VendorRegistrationForm } from '@/components/vendor/VendorRegistrationForm';

const VendorRegister = () => {
  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7f7f6] py-16 px-4">
        <VendorRegistrationForm />
        <div className="mt-6 text-center">
          <p className="text-[#4f4f56] mb-2">
            Already have an account?{' '}
            <Link to="/vendor/login" className="text-[#797a83] hover:underline font-semibold">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default VendorRegister;
