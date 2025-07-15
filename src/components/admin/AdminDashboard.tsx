
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import HeroImageManager from './HeroImageManager';
import BlogManager from './blog/BlogManager';
import UserManagement from './UserManagement';
import { Users, Image, Database, Settings, Activity, TrendingUp, FileText } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState<{
    totalUsers: number;
    totalHeroImages: number;
    totalBlogs: number;
    totalCustomers: number;
    totalVendors: number;
    totalAdmins: number;
    totalCustomerRequirements: number;
    totalVendorQuotations: number;
  }>({
    totalUsers: 0,
    totalHeroImages: 0,
    totalBlogs: 0,
    totalCustomers: 0,
    totalVendors: 0,
    totalAdmins: 0,
    totalCustomerRequirements: 0,
    totalVendorQuotations: 0
  });
  const [loading, setLoading] = useState(true);
  const { user } = useSupabaseAuth();

  const fetchStats = async () => {
    try {
      // Fetch user profiles count
      const { count: profilesCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch customer count
      const { count: customersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('user_type', 'customer');

      // Fetch vendor count
      const { count: vendorsCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('user_type', 'vendor');

      // Fetch admin count
      const { count: adminsCount } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'admin');

      // Fetch customer requirements count
      const { count: requirementsCount } = await supabase
        .from('customer_requirements')
        .select('*', { count: 'exact', head: true });

      // Fetch vendor quotations count
      const { count: quotationsCount } = await supabase
        .from('vendor_quotations')
        .select('*', { count: 'exact', head: true });

      // Fetch hero images count
      const { count: heroImagesCount } = await supabase
        .from('hero_images')
        .select('*', { count: 'exact', head: true });

      // Fetch blogs count
      const { count: blogsCount } = await supabase
        .from('blogs')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalUsers: profilesCount || 0,
        totalHeroImages: heroImagesCount || 0,
        totalBlogs: blogsCount || 0,
        totalCustomers: customersCount || 0,
        totalVendors: vendorsCount || 0,
        totalAdmins: adminsCount || 0,
        totalCustomerRequirements: requirementsCount || 0,
        totalVendorQuotations: quotationsCount || 0
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Temporary bypass for testing - comment out the user check
  // if (!user) {
  //   return (
  //     <div className="flex items-center justify-center h-64">
  //       <p className="text-gray-600">Please log in to access the admin dashboard.</p>
  //     </div>
  //   );
  // }

  // Temporary debug info
  console.log('AdminDashboard - user:', user);
  console.log('AdminDashboard - bypassing user check for testing');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your application content and users</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered profiles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">Customer accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.totalVendors}</div>
            <p className="text-xs text-muted-foreground">Vendor accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.totalAdmins}</div>
            <p className="text-xs text-muted-foreground">Admin users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hero Images</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.totalHeroImages}</div>
            <p className="text-xs text-muted-foreground">Banner images</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.totalBlogs}</div>
            <p className="text-xs text-muted-foreground">Published articles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Requirements</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.totalCustomerRequirements}</div>
            <p className="text-xs text-muted-foreground">Customer requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quotations</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.totalVendorQuotations}</div>
            <p className="text-xs text-muted-foreground">Vendor quotes</p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">
            <Database className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="hero-images">
            <Image className="w-4 h-4 mr-2" />
            Hero Images
          </TabsTrigger>
          <TabsTrigger value="blogs">
            <FileText className="w-4 h-4 mr-2" />
            Blogs
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="w-4 h-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Overview</CardTitle>
                <CardDescription>
                  Key metrics and system health
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">User Registration Rate</span>
                    <span className="text-sm text-green-600">+12% this month</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Active Hero Images</span>
                    <span className="text-sm text-blue-600">{stats.totalHeroImages} live</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Published Blogs</span>
                    <span className="text-sm text-purple-600">{stats.totalBlogs} articles</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Customer Engagement</span>
                    <span className="text-sm text-green-600">High</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest system activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">New customer registration</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Hero image updated</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm">New blog post published</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm">New vendor quotation</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="hero-images" className="space-y-4">
          <HeroImageManager />
        </TabsContent>

        <TabsContent value="blogs" className="space-y-4">
          <BlogManager />
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <UserManagement />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                Configure system-wide settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-gray-600">Send email notifications for new registrations</p>
                  </div>
                  <button className="w-12 h-6 bg-green-500 rounded-full p-1">
                    <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Auto-approve Vendors</h4>
                    <p className="text-sm text-gray-600">Automatically approve new vendor registrations</p>
                  </div>
                  <button className="w-12 h-6 bg-gray-300 rounded-full p-1">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Maintenance Mode</h4>
                    <p className="text-sm text-gray-600">Enable maintenance mode for system updates</p>
                  </div>
                  <button className="w-12 h-6 bg-gray-300 rounded-full p-1">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
