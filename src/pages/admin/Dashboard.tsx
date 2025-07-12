
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import AdminDashboard from '@/components/admin/AdminDashboard';
import Layout from '@/components/layout/Layout';

const AdminPanel = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useSupabaseAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAccess = async () => {
      // Temporary bypass for testing
      console.log('Admin access check - temporarily bypassing for testing');
      setIsAdmin(true);
      setLoading(false);
      return;

      if (!user && !authLoading) {
        navigate('/admin/login');
        return;
      }
      
      if (user) {
        try {
          // Check if user has admin role in database
          const { data: roles, error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .eq('role', 'admin');
          
          if (error) {
            console.error('Error checking admin role:', error);
            navigate('/admin/login');
            return;
          }
          
          if (roles && roles.length > 0) {
            setIsAdmin(true);
          } else {
            navigate('/admin/login');
            return;
          }
        } catch (error) {
          console.error('Error checking admin access:', error);
          navigate('/admin/login');
          return;
        }
      }
      
      setLoading(false);
    };

    checkAdminAccess();
  }, [user, authLoading, navigate]);

  if (loading || authLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-solar-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">Verifying admin access...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
            <button
              onClick={() => navigate('/admin/login')}
              className="bg-solar-primary text-white px-4 py-2 rounded hover:bg-solar-secondary"
            >
              Go to Admin Login
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <AdminDashboard />
    </Layout>
  );
};

export default AdminPanel;
