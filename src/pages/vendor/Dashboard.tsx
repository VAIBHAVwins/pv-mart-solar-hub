
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import Layout from '@/components/layout/Layout';
import { BarChart3, Users, FileText, TrendingUp, Plus, Eye } from 'lucide-react';

interface DashboardStats {
  totalQuotations: number;
  activeQuotations: number;
  acceptedQuotations: number;
  totalValue: number;
}

interface RecentQuotation {
  id: string;
  installation_type: string;
  system_type: string;
  total_price: number;
  created_at: string;
  status: string;
}

interface VendorProfile {
  contact_person?: string;
  company_name?: string;
}

const VendorDashboard = () => {
  const { user } = useSupabaseAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalQuotations: 0,
    activeQuotations: 0,
    acceptedQuotations: 0,
    totalValue: 0
  });
  const [recentQuotations, setRecentQuotations] = useState<RecentQuotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [vendorProfile, setVendorProfile] = useState<VendorProfile>({});

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      // Fetch vendor profile from the users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('contact_person, company_name')
        .eq('id', user.id)
        .single();

      if (userError) {
        console.error('Error fetching user data:', userError);
      } else if (userData) {
        setVendorProfile(userData);
      }

      // Fetch quotations
      const { data: quotations } = await supabase
        .from('vendor_quotations')
        .select('*')
        .eq('vendor_id', user.id)
        .order('created_at', { ascending: false });

      if (quotations) {
        // Calculate stats
        const totalQuotations = quotations.length;
        const activeQuotations = quotations.filter(q => q.status === 'submitted').length;
        const acceptedQuotations = quotations.filter(q => q.status === 'accepted').length;
        const totalValue = quotations.reduce((sum, q) => sum + (q.total_price || 0), 0);

        setStats({
          totalQuotations,
          activeQuotations,
          acceptedQuotations,
          totalValue
        });

        // Set recent quotations
        setRecentQuotations(quotations.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-6 text-center">
              <p>Please log in to access your vendor dashboard.</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {vendorProfile.contact_person || 'Vendor'}!
          </h1>
          <p className="text-gray-600">
            {vendorProfile.company_name && `${vendorProfile.company_name} • `}
            Manage your solar quotations and business
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Quotations</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalQuotations}</div>
              <p className="text-xs text-muted-foreground">All time submissions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Quotations</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeQuotations}</div>
              <p className="text-xs text-muted-foreground">Pending response</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accepted</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.acceptedQuotations}</div>
              <p className="text-xs text-muted-foreground">Successful deals</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.totalValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Lifetime quotation value</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" asChild>
                <a href="/vendor/quotation-submission">
                  <Plus className="mr-2 h-4 w-4" />
                  Submit New Quotation
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="/vendor/my-quotations">
                  <Eye className="mr-2 h-4 w-4" />
                  View My Quotations
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="/vendor/messages">
                  <FileText className="mr-2 h-4 w-4" />
                  Messages & Support
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest quotations</CardDescription>
            </CardHeader>
            <CardContent>
              {recentQuotations.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No quotations yet</p>
              ) : (
                <div className="space-y-3">
                  {recentQuotations.map((quotation) => (
                    <div key={quotation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">
                          {quotation.installation_type} - {quotation.system_type}
                        </p>
                        <p className="text-xs text-gray-500">
                          ₹{quotation.total_price?.toLocaleString()} • {new Date(quotation.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={getStatusColor(quotation.status || 'draft')}>
                        {quotation.status || 'draft'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Performance Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>Your business metrics at a glance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.totalQuotations > 0 ? Math.round((stats.acceptedQuotations / stats.totalQuotations) * 100) : 0}%
                </div>
                <p className="text-sm text-gray-600">Success Rate</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  ₹{stats.acceptedQuotations > 0 ? Math.round(stats.totalValue / stats.acceptedQuotations).toLocaleString() : 0}
                </div>
                <p className="text-sm text-gray-600">Avg Deal Value</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.activeQuotations}</div>
                <p className="text-sm text-gray-600">Pending Responses</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default VendorDashboard;
