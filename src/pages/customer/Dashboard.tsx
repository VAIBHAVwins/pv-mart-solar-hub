import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

// CURSOR AI: Modern, professional Customer Dashboard redesign with customer color palette and UI patterns
export default function CustomerDashboard() {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/customer/login');
    }
  }, [user, loading, navigate]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!user) return null;

  const handleRequirementClick = () => {
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSdbuVmhwpsO4LYaUv4v9TDKPL_FxPBNAOquU6SLUhnf72NuWQ/viewform?usp=header', '_blank');
  };

  const handleSupabaseRequirementClick = () => {
    navigate('/customer/supabase-requirement');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-[#fecb00] to-[#f8b200] py-16 px-4">
        <div className="container mx-auto">
          <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl font-extrabold mb-4 text-[#8b4a08] drop-shadow">Customer Dashboard</h1>
            <p className="mb-6 text-[#52796f] text-lg">
              Welcome, <span className="font-semibold text-[#3d1604]">{user.email}</span>
            </p>
            <div className="mb-8">
              <span className="inline-block bg-[#fecb00] text-[#190a02] px-4 py-2 rounded-full font-semibold shadow">Customer Account</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <button onClick={handleRequirementClick} className="bg-[#fecb00] p-6 rounded-xl hover:bg-[#f8b200] transition-colors cursor-pointer">
                <h3 className="text-xl font-bold text-[#190a02] mb-2">Google Form Requirement</h3>
                <p className="text-[#8b4a08]">Fill out requirements using Google Forms</p>
              </button>
              
              <button onClick={handleSupabaseRequirementClick} className="bg-[#8b4a08] p-6 rounded-xl hover:bg-[#3d1604] transition-colors cursor-pointer">
                <h3 className="text-xl font-bold text-white mb-2">Supabase Customer Requirement Form</h3>
                <p className="text-[#fecb00]">Submit detailed requirements for better matching</p>
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={signOut}
                className="bg-[#8b4a08] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#3d1604] transition shadow-md"
              >
                Logout
              </Button>
              <Button variant="outline" className="border-[#8b4a08] text-[#8b4a08] hover:bg-[#8b4a08] hover:text-white" onClick={() => navigate('/')}>Back to Home</Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
