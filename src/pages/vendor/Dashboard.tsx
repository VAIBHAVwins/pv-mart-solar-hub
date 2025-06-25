// ENHANCED BY CURSOR AI: Vendor Dashboard with email verification check
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import EmailVerificationNotice from '@/components/common/EmailVerificationNotice';
import { useAuth } from '@/contexts/AuthContext';

// CURSOR AI: Modern, professional Vendor Dashboard redesign with vendor color palette and UI patterns
export default function VendorDashboard() {
  const { user, logout, loading } = useAuth();
  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!user) return null;
  if (!user.emailVerified) {
    // CURSOR AI: Block dashboard if email not verified
    return <EmailVerificationNotice user={user} />;
  }
  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7f7f6] py-16 px-4">
        <div className="bg-[#e6d3b3] p-10 rounded-2xl shadow-xl w-full max-w-lg text-center animate-fade-in">
          <h1 className="text-4xl font-extrabold mb-4 text-[#797a83] drop-shadow">Vendor Dashboard</h1>
          <p className="mb-6 text-[#4f4f56] text-lg">Welcome, <span className="font-semibold text-[#b07e66]">{user.email}</span></p>
          <div className="mb-8">
            <span className="inline-block bg-[#b07e66] text-[#f7f7f6] px-4 py-2 rounded-full font-semibold shadow">Vendor Account</span>
          </div>
          {logout && (
            <Button
              onClick={logout}
              className="bg-[#797a83] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#4f4f56] transition shadow-md"
            >
              Logout
            </Button>
          )}
        </div>
      </div>
    </Layout>
  );
} 