import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building, Phone, Mail, MapPin, Award, CheckCircle, Clock } from 'lucide-react';

const VendorDashboard = () => {
  const { user, loading: authLoading } = useSupabaseAuth();
  const [vendorData, setVendorData] = useState<{
    company_name?: string;
    contact_person?: string;
    phone?: string;
    email?: string;
    address?: string;
    license_number?: string;
    pm_surya_ghar_registered?: string;
    role?: string;
  }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVendorData = async () => {
      if (!user) return;

      try {
        console.log('🔄 Fetching vendor data for user:', user.id);
        
        const { data, error } = await supabase
          .from('users')
          .select('company_name, contact_person, phone, email, address, license_number, pm_surya_ghar_registered, role')
          .eq('id', user.id)
          .eq('role', 'vendor')
          .single();

        if (error) {
          console.error('❌ Error fetching vendor data:', error);
          setError('Failed to load vendor data');
          return;
        }

        console.log('✅ Vendor data fetched successfully:', data);
        // Convert boolean pm_surya_ghar_registered to string if needed
        const processedData = {
          ...data,
          pm_surya_ghar_registered: typeof data?.pm_surya_ghar_registered === 'boolean' 
            ? (data.pm_surya_ghar_registered ? 'YES' : 'NO')
            : data?.pm_surya_ghar_registered || 'NO'
        };
        setVendorData(processedData || {});
      } catch (error) {
        console.error('❌ Error in fetchVendorData:', error);
        setError('Failed to load vendor data');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchVendorData();
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg text-red-600">Please log in to access the vendor dashboard.</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg text-red-600">{error}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {vendorData.contact_person || 'Vendor'}!
          </h1>
          <p className="text-gray-600">
            Manage your solar business and track your quotations from your dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Vendor Profile Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Company Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm text-gray-600 mb-1">Company Name</h4>
                  <p className="text-gray-900">{vendorData.company_name || 'Not provided'}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-600 mb-1">Contact Person</h4>
                  <p className="text-gray-900">{vendorData.contact_person || 'Not provided'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-900">{vendorData.phone || 'Not provided'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-900">{vendorData.email || 'Not provided'}</span>
                </div>
              </div>
              
              {vendorData.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                  <span className="text-gray-900">{vendorData.address}</span>
                </div>
              )}

              {vendorData.license_number && (
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-900">License: {vendorData.license_number}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                {vendorData.pm_surya_ghar_registered === 'YES' ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Clock className="h-4 w-4 text-yellow-500" />
                )}
                <span className="text-gray-900">
                  PM Surya Ghar: {vendorData.pm_surya_ghar_registered === 'YES' ? 'Registered' : 'Not Registered'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="default">
                View Customer Requirements
              </Button>
              <Button className="w-full" variant="outline">
                Create New Quotation
              </Button>
              <Button className="w-full" variant="outline">
                My Quotations
              </Button>
              <Button className="w-full" variant="outline">
                Update Profile
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">0</div>
              <div className="text-sm text-gray-600">Active Quotations</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-gray-600">Accepted Quotations</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">0</div>
              <div className="text-sm text-gray-600">Pending Reviews</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">₹0</div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default VendorDashboard;
