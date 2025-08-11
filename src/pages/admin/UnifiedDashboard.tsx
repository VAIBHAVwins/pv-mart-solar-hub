
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import DashboardStats from '@/components/admin/DashboardStats';
import HeroImageManager from '@/components/admin/HeroImageManager';
import BlogManager from '@/components/admin/blog/BlogManager';
import VendorManagement from '@/components/admin/VendorManagement';
import CustomerManagement from '@/components/admin/CustomerManagement';
import QuotationsManagement from '@/components/admin/QuotationsManagement';
import RequirementsManagement from '@/components/admin/RequirementsManagement';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, RefreshCw, Bell, Calendar, TrendingUp, Calculator, Zap, Database, Settings, Users, FileText, BarChart3, Image, MessageSquare, Quote } from 'lucide-react';

const UnifiedAdminDashboard = () => {
  const { user, signOut } = useSupabaseAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleSignOut = async () => {
    if (user) {
      await signOut();
    }
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">PV Mart Control Center - {user?.email || 'Direct Access'}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              
              <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                {user ? 'Sign Out' : 'Go Home'}
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Welcome Section */}
            <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <CardHeader>
                <CardTitle className="text-xl">PV Mart Control Center</CardTitle>
                <CardDescription className="text-blue-100">
                  Manage your solar energy marketplace platform with unified dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">
                      Monitor real-time statistics, manage content, and control platform operations
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-blue-100">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Electricity Bill Calculator Management Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="w-5 h-5 mr-2 text-blue-600" />
                  Electricity Bill Calculator Management
                </CardTitle>
                <CardDescription>
                  Manage electricity providers, tariff rates, and billing configurations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-center space-y-2"
                    onClick={() => navigate('/admin/bihar-tariff-manager')}
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Zap className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium">Bihar Tariff Manager</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-center space-y-2"
                    onClick={() => navigate('/admin/providers')}
                  >
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Database className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm font-medium">Electricity Providers</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-center space-y-2"
                    onClick={() => navigate('/admin/tariff-config')}
                  >
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Settings className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium">Tariff Configuration</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-center space-y-2"
                    onClick={() => navigate('/admin/bill-analytics')}
                  >
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <FileText className="w-4 h-4 text-orange-600" />
                    </div>
                    <span className="text-sm font-medium">Bill Analytics</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Live Stats */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                  Live Platform Statistics
                </h2>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Auto-refreshing every 30 seconds</span>
                </div>
              </div>
              <DashboardStats />
            </div>

            {/* Main Management Tabs */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Management</CardTitle>
                <CardDescription>
                  Manage all aspects of your PV Mart platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="overview" className="flex items-center">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="hero-images" className="flex items-center">
                      <Image className="w-4 h-4 mr-2" />
                      Hero Images
                    </TabsTrigger>
                    <TabsTrigger value="blogs" className="flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Blogs
                    </TabsTrigger>
                    <TabsTrigger value="vendors" className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      Vendors
                    </TabsTrigger>
                    <TabsTrigger value="customers" className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      Customers
                    </TabsTrigger>
                    <TabsTrigger value="quotations" className="flex items-center">
                      <Quote className="w-4 h-4 mr-2" />
                      Quotations
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="mt-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Platform Overview</h3>
                      <p className="text-gray-600">
                        Welcome to the unified admin dashboard. Use the tabs above to manage different aspects of your platform.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Card className="p-4">
                          <h4 className="font-medium mb-2">Recent Activity</h4>
                          <p className="text-sm text-gray-600">Monitor recent platform activities and user interactions.</p>
                        </Card>
                        <Card className="p-4">
                          <h4 className="font-medium mb-2">System Status</h4>
                          <p className="text-sm text-gray-600">All systems operational and running smoothly.</p>
                        </Card>
                        <Card className="p-4">
                          <h4 className="font-medium mb-2">Quick Stats</h4>
                          <p className="text-sm text-gray-600">Key metrics are displayed in the statistics section above.</p>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="hero-images" className="mt-6">
                    <HeroImageManager />
                  </TabsContent>

                  <TabsContent value="blogs" className="mt-6">
                    <BlogManager />
                  </TabsContent>

                  <TabsContent value="vendors" className="mt-6">
                    <VendorManagement />
                  </TabsContent>

                  <TabsContent value="customers" className="mt-6">
                    <CustomerManagement />
                  </TabsContent>

                  <TabsContent value="quotations" className="mt-6">
                    <QuotationsManagement />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Access frequently used admin functions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-center space-y-2"
                    onClick={() => navigate('/admin/hero-banners')}
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-bold">+</span>
                    </div>
                    <span className="text-sm font-medium">Add Hero Banner</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-center space-y-2"
                    onClick={() => navigate('/admin/blog-manager')}
                  >
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-sm font-bold">+</span>
                    </div>
                    <span className="text-sm font-medium">Create Blog Post</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-center space-y-2"
                    onClick={() => navigate('/admin/users')}
                  >
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium">Manage Users</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-center space-y-2"
                    onClick={() => navigate('/admin/requirements')}
                  >
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-orange-600" />
                    </div>
                    <span className="text-sm font-medium">View Requirements</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UnifiedAdminDashboard;
