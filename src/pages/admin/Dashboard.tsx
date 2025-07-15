
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import AdminDashboard from '@/components/admin/AdminDashboard';
import Layout from '@/components/layout/Layout';

const AdminPanel = () => {
  return (
    <Layout>
      <AdminDashboard />
    </Layout>
  );
};

export default AdminPanel;
