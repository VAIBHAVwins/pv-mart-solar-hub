import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPlus, Building2, Zap, FileText, Image } from 'lucide-react';

interface QuickAction {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  href: string;
  color: string;
}

const UnifiedDashboard = () => {
  const quickActions = [
    {
      title: "Add Customer",
      description: "Register a new customer",
      icon: UserPlus,
      href: "/admin/customers",
      color: "bg-blue-500"
    },
    {
      title: "Add Vendor",
      description: "Register a new vendor",
      icon: Building2,
      href: "/admin/vendors",
      color: "bg-green-500"
    },
    {
      title: "Bihar Tariff Manager",
      description: "Manage Bihar electricity tariffs",
      icon: Zap,
      href: "/admin/bihar-tariff-manager",
      color: "bg-yellow-500"
    },
    {
      title: "CESC Tariff Manager",
      description: "Manage CESC electricity tariffs",
      icon: Zap,
      href: "/admin/cesc-tariff-manager",
      color: "bg-orange-500"
    },
    {
      title: "Blog Manager",
      description: "Create and manage blog posts",
      icon: FileText,
      href: "/admin/blog-manager",
      color: "bg-purple-500"
    },
    {
      title: "Hero Banners",
      description: "Manage homepage banners",
      icon: Image,
      href: "/admin/hero-banners",
      color: "bg-pink-500"
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Unified Admin Dashboard</h1>
        <p className="text-gray-600 text-lg mb-8">
          Welcome to the central hub for managing all aspects of the application.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.href}>
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{action.title}</CardTitle>
                  <action.icon className={`w-4 h-4 text-white rounded-full p-0.5 ${action.color}`} />
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-500">{action.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default UnifiedDashboard;
