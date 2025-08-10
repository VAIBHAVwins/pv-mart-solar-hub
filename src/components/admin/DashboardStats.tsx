
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, Quote, FileText, Image, BarChart3 } from 'lucide-react';

interface Stats {
  customers: number;
  vendors: number;
  quotations: number;
  requirements: number;
  heroImages: number;
  blogs: number;
}

const DashboardStats = () => {
  const [stats, setStats] = useState<Stats>({
    customers: 0,
    vendors: 0,
    quotations: 0,
    requirements: 0,
    heroImages: 0,
    blogs: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const [
        customersRes,
        vendorsRes,
        quotationsRes,
        requirementsRes,
        heroImagesRes,
        blogsRes
      ] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact' }).eq('role', 'customer'),
        supabase.from('users').select('id', { count: 'exact' }).eq('role', 'vendor'),
        supabase.from('vendor_quotations').select('id', { count: 'exact' }),
        supabase.from('customer_requirements').select('id', { count: 'exact' }),
        supabase.from('hero_images').select('id', { count: 'exact' }).eq('is_active', true),
        supabase.from('blogs').select('id', { count: 'exact' }).eq('status', 'published')
      ]);

      setStats({
        customers: customersRes.count || 0,
        vendors: vendorsRes.count || 0,
        quotations: quotationsRes.count || 0,
        requirements: requirementsRes.count || 0,
        heroImages: heroImagesRes.count || 0,
        blogs: blogsRes.count || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    {
      title: 'Total Customers',
      value: stats.customers,
      description: 'Registered customers',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Total Vendors',
      value: stats.vendors,
      description: 'Verified vendors',
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Total Quotations',
      value: stats.quotations,
      description: 'Submitted quotations',
      icon: Quote,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Total Requirements',
      value: stats.requirements,
      description: 'Customer requests',
      icon: BarChart3,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Active Hero Banners',
      value: stats.heroImages,
      description: 'Live banners',
      icon: Image,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    },
    {
      title: 'Published Blogs',
      value: stats.blogs,
      description: 'Published articles',
      icon: FileText,
      color: 'text-teal-600',
      bgColor: 'bg-teal-100'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stat.value.toLocaleString()}
              </div>
              <CardDescription>{stat.description}</CardDescription>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardStats;
