
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import AdminDashboard from '@/components/admin/AdminDashboard';
import Layout from '@/components/layout/Layout';

// Same hardcoded admin credentials as in Login
const ADMIN_CREDENTIALS = [
  {
    email: 'ecogrid.ai@gmail.com',
    password: 'ECOGRID_AI-28/02/2025',
    name: 'EcoGrid Admin'
  }
  // Add more admin credentials here as needed
];

const AdminPanel = () => {
  // const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  // const [loading, setLoading] = useState(true);
  // const { user } = useSupabaseAuth();
  // const navigate = useNavigate();

  // useEffect(() => {
  //   const checkAdminAccess = async () => {
  //     if (!user) {
  //       navigate('/admin/login');
  //       return;
  //     }
  //     try {
  //       const isAdminUser = ADMIN_CREDENTIALS.some(admin => admin.email === user.email);
  //       if (!isAdminUser) {
  //         navigate('/admin/login');
  //         return;
  //       }
  //       setIsAdmin(true);
  //     } catch (error) {
  //       console.error('Error checking admin access:', error);
  //       navigate('/admin/login');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   checkAdminAccess();
  // }, [user, navigate]);

  // if (loading) {
  //   return (
  //     <Layout>
  //       <div className="flex items-center justify-center h-screen">
  //         <div className="text-center">
  //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-solar-primary mx-auto"></div>
  //           <p className="mt-2 text-gray-600">Verifying admin access...</p>
  //         </div>
  //       </div>
  //     </Layout>
  //   );
  // }

  // if (!isAdmin) {
  //   return (
  //     <Layout>
  //       <div className="flex items-center justify-center h-screen">
  //         <div className="text-center">
  //           <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
  //           <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
  //           <button
  //             onClick={() => navigate('/admin/login')}
  //             className="bg-solar-primary text-white px-4 py-2 rounded hover:bg-solar-secondary"
  //           >
  //             Go to Admin Login
  //           </button>
  //         </div>
  //       </div>
  //     </Layout>
  //   );
  // }

  return (
    <Layout>
      <AdminDashboard />
    </Layout>
  );
};

export default AdminPanel;
