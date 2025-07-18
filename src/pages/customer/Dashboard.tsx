
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function CustomerDashboard() {
  const { user, signOut, loading, userRole } = useSupabaseAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ full_name?: string } | null>(null);

  useEffect(() => {
    if (!loading && (!user || userRole !== 'customer')) {
      navigate('/customer/login');
      return;
    }
    
    if (user && userRole === 'customer') {
      fetchProfile();
    }
  }, [user, loading, userRole, navigate]);

  const fetchProfile = async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from('users')
        .select('full_name')
        .eq('id', user.id)
        .eq('role', 'customer')
        .maybeSingle();
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!user || userRole !== 'customer') {
    return null;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-[#fecb00] to-[#f8b200] py-16 px-4">
        <div className="container mx-auto">
          <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl font-extrabold mb-4 text-[#8b4a08] drop-shadow">Customer Dashboard</h1>
            <p className="mb-6 text-[#52796f] text-lg">
              Welcome <span className="font-semibold text-[#3d1604]">{profile?.full_name || user?.email || 'Customer'}</span>
            </p>
            <div className="mb-8">
              <span className="inline-block bg-[#fecb00] text-[#190a02] px-4 py-2 rounded-full font-semibold shadow">Customer Account</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <a 
                href="https://docs.google.com/forms/d/e/1FAIpQLSdbuVmhwpsO4LYaUv4v9TDKPL_FxPBNAOquU6SLUhnf72NuWQ/viewform" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-[#fecb00] p-6 rounded-xl hover:bg-[#f8b200] transition-colors cursor-pointer flex flex-col items-center justify-center"
              >
                <h3 className="text-xl font-bold text-[#190a02] mb-2">Consumer Requirement Form (Google Form)</h3>
                <p className="text-[#8b4a08]">Submit your requirement via Google Form</p>
              </a>
              <a 
                href="/customer/requirements" 
                className="bg-[#fecb00] p-6 rounded-xl hover:bg-[#f8b200] transition-colors cursor-pointer flex flex-col items-center justify-center"
              >
                <h3 className="text-xl font-bold text-[#190a02] mb-2">Consumer Requirement Form (Supabase)</h3>
                <p className="text-[#8b4a08]">Submit your requirement via Supabase</p>
              </a>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={signOut}
                className="bg-[#8b4a08] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#3d1604] transition shadow-md"
              >
                Logout
              </Button>
              <Button variant="outline" className="border-[#8b4a08] text-[#8b4a08] hover:bg-[#8b4a08] hover:text-white" onClick={() => navigate('/')}>
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
