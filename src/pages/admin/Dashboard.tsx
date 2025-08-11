
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import AdminDashboard from '@/components/admin/AdminDashboard';

const AdminPanel = () => {
  const { user } = useSupabaseAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuthorization = async () => {
      if (!user?.email) {
        navigate('/admin/login');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('email, is_active')
          .eq('email', user.email)
          .eq('is_active', true)
          .single();

        if (error || !data) {
          console.error('Admin authorization failed:', error);
          navigate('/admin/login');
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error('Authorization check error:', error);
        navigate('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuthorization();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <AdminDashboard />;
};

export default AdminPanel;
