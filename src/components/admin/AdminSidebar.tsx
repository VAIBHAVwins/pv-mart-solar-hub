
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Users,
  FileText,
  MessageSquare,
  BarChart3,
  Settings,
  Image,
  PenTool,
  Calculator,
  Zap,
  Database,
  Home,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  
  const menuItems = [
    { path: '/admin/unified-dashboard', icon: Home, label: 'Dashboard' },
    { path: '/admin/customers', icon: Users, label: 'Customers' },
    { path: '/admin/vendors', icon: Users, label: 'Vendors' },
    { path: '/admin/requirements', icon: FileText, label: 'Requirements' },
    { path: '/admin/quotations', icon: MessageSquare, label: 'Quotations' },
    { path: '/admin/blog-manager', icon: PenTool, label: 'Blog Manager' },
    { path: '/admin/hero-banners', icon: Image, label: 'Hero Banners' },
    { path: '/admin/users', icon: Settings, label: 'Admin Users' },
  ];

  const calculatorItems = [
    { path: '/admin/bihar-tariff-manager', icon: Zap, label: 'Bihar Tariff Manager' },
    { path: '/admin/providers', icon: Database, label: 'Electricity Providers' },
    { path: '/admin/tariff-config', icon: Settings, label: 'Tariff Configuration' },
    { path: '/admin/bill-analytics', icon: BarChart3, label: 'Bill Analytics' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">PV</span>
          </div>
          <span className="text-xl font-bold text-gray-900">Admin Panel</span>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive(item.path)
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
          
          {/* Electricity Bill Calculator Section */}
          <div className="pt-4">
            <button
              onClick={() => setIsCalculatorOpen(!isCalculatorOpen)}
              className={cn(
                'flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                calculatorItems.some(item => isActive(item.path))
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <div className="flex items-center space-x-3">
                <Calculator className="w-5 h-5" />
                <span>Bill Calculator</span>
              </div>
              {isCalculatorOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            
            {isCalculatorOpen && (
              <div className="ml-6 mt-2 space-y-1">
                {calculatorItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive(item.path)
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;
