// ENHANCED BY CURSOR AI: Vendor Dashboard with proper navigation
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

// CURSOR AI: Modern, professional Vendor Dashboard redesign with vendor color palette and UI patterns
export default function VendorDashboard() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/vendor/login');
    }
  }, [user, loading, navigate]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!user) return null;

  const handleQuotationClick = () => {
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSdjkFe1q934yAptp69UlOghFzFwrYrk7IQpOI101axO3M4WXQ/viewform?usp=header', '_blank');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-[#797a83] to-[#4f4f56] py-16 px-4">
        <div className="container mx-auto">
          <div className="bg-[#f7f7f6] p-10 rounded-2xl shadow-xl w-full max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl font-extrabold mb-4 text-[#797a83] drop-shadow">Vendor Dashboard</h1>
            <p className="mb-6 text-[#4f4f56] text-lg">Welcome, <span className="font-semibold text-[#b07e66]">{user.email}</span></p>
            <div className="mb-8">
              <span className="inline-block bg-[#b07e66] text-[#f7f7f6] px-4 py-2 rounded-full font-semibold shadow">Vendor Account</span>
            </div>
            
            <div className="mb-8">
              <button onClick={handleQuotationClick} className="bg-[#b07e66] p-6 rounded-xl hover:bg-[#797a83] transition-colors cursor-pointer max-w-md mx-auto w-full">
                <h3 className="text-xl font-bold text-[#f7f7f6] mb-2">Submit Quotation</h3>
                <p className="text-[#f7f7f6] opacity-90">Submit quotations for customer requirements</p>
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={logout}
                className="bg-[#797a83] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#4f4f56] transition shadow-md"
              >
                Logout
              </Button>
              <Button variant="outline" className="border-[#797a83] text-[#797a83] hover:bg-[#797a83] hover:text-white" onClick={() => navigate('/')}>Back to Home</Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 