
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function VendorDashboard() {
  const { user, signOut, loading, userRole } = useSupabaseAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ contact_person?: string; company_name?: string } | null>(null);

  useEffect(() => {
    if (!loading && (!user || userRole !== 'vendor')) {
      navigate('/vendor/login');
      return;
    }
    
    if (user && userRole === 'vendor') {
      fetchProfile();
    }
  }, [user, loading, userRole, navigate]);

  const fetchProfile = async () => {
    if (!user) return;
    try {
      // Get vendor profile from vendor_profiles table
      const { data: vendorProfile, error: vendorError } = await supabase
        .from('vendor_profiles')
        .select('contact_person, company_name')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (vendorError) {
        console.error('Error fetching vendor profile:', vendorError);
        setProfile(null);
        return;
      }

      if (vendorProfile) {
        setProfile({
          contact_person: vendorProfile.contact_person,
          company_name: vendorProfile.company_name
        });
      } else {
        // Fallback to users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('full_name')
          .eq('id', user.id)
          .eq('role', 'vendor')
          .maybeSingle();
        
        if (userData) {
          setProfile({
            contact_person: userData.full_name,
            company_name: null
          });
        } else {
          setProfile(null);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
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

  if (!user || userRole !== 'vendor') {
    return null;
  }

  const handleQuotationClick = () => {
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSdjkFe1q934yAptp69UlOghFzFwrYrk7IQpOI101axO3M4WXQ/viewform?usp=header', '_blank');
  };

  const handleSupabaseQuotationClick = () => {
    navigate('/vendor/supabase-quotation');
  };

  const getWelcomeMessage = () => {
    if (!profile) return 'Vendor';
    
    const contactPerson = profile.contact_person || 'Vendor';
    const companyName = profile.company_name;
    
    if (contactPerson && companyName) {
      return `${contactPerson} from ${companyName}`;
    } else if (contactPerson) {
      return contactPerson;
    }
    return 'Vendor';
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-[#797a83] to-[#4f4f56] py-16 px-4">
        <div className="container mx-auto">
          <div className="bg-[#f7f7f6] p-10 rounded-2xl shadow-xl w-full max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl font-extrabold mb-4 text-[#797a83] drop-shadow">Vendor Dashboard</h1>
            <p className="mb-6 text-[#4f4f56] text-lg">
              Welcome <span className="font-semibold text-[#b07e66]">
                {getWelcomeMessage()}
              </span>
            </p>
            <div className="mb-8">
              <span className="inline-block bg-[#b07e66] text-[#f7f7f6] px-4 py-2 rounded-full font-semibold shadow">Vendor Account</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <button onClick={handleQuotationClick} className="bg-[#b07e66] p-6 rounded-xl hover:bg-[#797a83] transition-colors cursor-pointer">
                <h3 className="text-xl font-bold text-[#f7f7f6] mb-2">Google Form Quotation</h3>
                <p className="text-[#f7f7f6] opacity-90">Submit quotations using Google Forms</p>
              </button>
              
              <button onClick={handleSupabaseQuotationClick} className="bg-[#797a83] p-6 rounded-xl hover:bg-[#4f4f56] transition-colors cursor-pointer">
                <h3 className="text-xl font-bold text-[#f7f7f6] mb-2">Supabase Vendor Quotation</h3>
                <p className="text-[#f7f7f6] opacity-90">Submit detailed quotations with components</p>
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={signOut}
                className="bg-[#797a83] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#4f4f56] transition shadow-md"
              >
                Logout
              </Button>
              <Button variant="outline" className="border-[#797a83] text-[#797a83] hover:bg-[#797a83] hover:text-white" onClick={() => navigate('/')}>
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
