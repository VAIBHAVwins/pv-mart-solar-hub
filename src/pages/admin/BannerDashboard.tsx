import { useEffect, useState } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import BannerAdmin from '@/components/admin/banner/BannerAdmin';

export default function BannerDashboard() {
  return (
    <div className="flex items-center justify-center min-h-screen flex-col">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Banner Dashboard</h1>
      <BannerAdmin />
    </div>
  );
} 
