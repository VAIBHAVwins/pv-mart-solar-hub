import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import EmailVerificationNotice from '@/components/common/EmailVerificationNotice';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

// CURSOR AI: Modern, professional Customer Dashboard redesign with customer color palette and UI patterns
export default function CustomerDashboard() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!user) return null;
  if (!user.emailVerified) {
    // CURSOR AI: Block dashboard if email not verified
    return <EmailVerificationNotice user={user} />;
  }

  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fff8e1] py-16 px-4">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-lg text-center animate-fade-in">
          <h1 className="text-4xl font-extrabold mb-4 text-[#8b4a08] drop-shadow">Welcome to Your Dashboard</h1>
          <p className="mb-6 text-[#52796f] text-lg">Hello, <span className="font-semibold text-[#3d1604]">{user.email}</span></p>
          <div className="mb-8">
            <span className="inline-block bg-[#fecb00] text-[#190a02] px-4 py-2 rounded-full font-semibold shadow">Customer Account</span>
          </div>
          <Button
            onClick={logout}
            className="bg-[#8b4a08] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#3d1604] transition shadow-md"
          >
            Logout
          </Button>
        </div>
      </div>
    </Layout>
  );
} 