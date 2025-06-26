import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

// CURSOR AI: Modern, professional Customer Dashboard redesign with customer color palette and UI patterns
export default function CustomerDashboard() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/customer/login');
    }
  }, [user, loading, navigate]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!user) return null;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-[#fecb00] to-[#f8b200] py-16 px-4">
        <div className="container mx-auto">
          <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl font-extrabold mb-4 text-[#8b4a08] drop-shadow">Customer Dashboard</h1>
            <p className="mb-6 text-[#52796f] text-lg">Welcome, <span className="font-semibold text-[#3d1604]">{user.email}</span></p>
            <div className="mb-8">
              <span className="inline-block bg-[#fecb00] text-[#190a02] px-4 py-2 rounded-full font-semibold shadow">Customer Account</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Link to="/customer/quote-request">
                <div className="bg-[#fecb00] p-6 rounded-xl hover:bg-[#f8b200] transition-colors cursor-pointer">
                  <h3 className="text-xl font-bold text-[#190a02] mb-2">Submit Requirement</h3>
                  <p className="text-[#8b4a08]">Fill out your solar installation requirements</p>
                </div>
              </Link>
              
              <Link to="/customer/requirements">
                <div className="bg-[#f8b200] p-6 rounded-xl hover:bg-[#fecb00] transition-colors cursor-pointer">
                  <h3 className="text-xl font-bold text-[#190a02] mb-2">View Requirements</h3>
                  <p className="text-[#8b4a08]">Check your submitted requirements and quotes</p>
                </div>
              </Link>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={logout}
                className="bg-[#8b4a08] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#3d1604] transition shadow-md"
              >
                Logout
              </Button>
              <Link to="/">
                <Button variant="outline" className="border-[#8b4a08] text-[#8b4a08] hover:bg-[#8b4a08] hover:text-white">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 