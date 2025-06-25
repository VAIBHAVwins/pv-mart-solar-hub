
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Users, FileText, MessageSquare, Settings, BarChart3 } from 'lucide-react';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [stats] = useState({
    totalUsers: 156,
    totalQuotes: 89,
    pendingQuotes: 23,
    totalVendors: 34,
    totalCustomers: 122
  });

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.email}</p>
            </div>
            {logout && (
              <Button onClick={logout} variant="outline">
                Logout
              </Button>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCustomers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalVendors}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Quotes</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalQuotes}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Quotes</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingQuotes}</div>
              </CardContent>
            </Card>
          </div>

          {/* Admin Tabs */}
          <Tabs defaultValue="users" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="quotes">Quote Management</TabsTrigger>
              <TabsTrigger value="content">Content Management</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Recent Users</h3>
                      <Button>View All Users</Button>
                    </div>
                    <div className="border rounded-lg p-4">
                      <p className="text-gray-600">User management functionality will be implemented here.</p>
                      <p className="text-sm text-gray-500 mt-2">Features: View users, verify vendors, manage accounts, user analytics</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quotes">
              <Card>
                <CardHeader>
                  <CardTitle>Quote Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Quote Requests</h3>
                      <Button>View All Quotes</Button>
                    </div>
                    <div className="border rounded-lg p-4">
                      <p className="text-gray-600">Quote management system will be implemented here.</p>
                      <p className="text-sm text-gray-500 mt-2">Features: Assign quotes to vendors, track progress, quality control</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content">
              <Card>
                <CardHeader>
                  <CardTitle>Content Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Hero Section Management</h3>
                      <div className="border rounded-lg p-4">
                        <Button className="mb-3">Upload New Hero Image</Button>
                        <p className="text-gray-600">Manage homepage hero images and content.</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Blog Management</h3>
                      <div className="border rounded-lg p-4">
                        <div className="flex gap-3 mb-3">
                          <Button>Add New Post</Button>
                          <Button variant="outline">Manage Posts</Button>
                        </div>
                        <p className="text-gray-600">Create and manage blog posts about solar energy.</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Advertisement Management</h3>
                      <div className="border rounded-lg p-4">
                        <Button className="mb-3">Manage Ads</Button>
                        <p className="text-gray-600">Control advertisements displayed on the platform.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="messages">
              <Card>
                <CardHeader>
                  <CardTitle>Messages & Communication</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4">
                    <p className="text-gray-600">Message management system will be implemented here.</p>
                    <p className="text-sm text-gray-500 mt-2">Features: View all messages, moderate communications, send announcements</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Platform Settings</h3>
                      <div className="border rounded-lg p-4">
                        <p className="text-gray-600">System configuration and settings.</p>
                        <p className="text-sm text-gray-500 mt-2">Features: Email settings, platform fees, vendor verification criteria</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
