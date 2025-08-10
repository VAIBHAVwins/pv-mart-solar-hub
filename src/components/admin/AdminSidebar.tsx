
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Users, 
  Image, 
  FileText, 
  Settings, 
  Shield, 
  Home,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  BarChart3,
  Quote
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    { 
      icon: Home, 
      label: 'Dashboard', 
      path: '/admin/dashboard',
      description: 'Overview & Stats'
    },
    { 
      icon: Shield, 
      label: 'Admin Users', 
      path: '/admin/users',
      description: 'Manage Admins'
    },
    { 
      icon: Image, 
      label: 'Hero Banners', 
      path: '/admin/banners',
      description: 'Homepage Banners'
    },
    { 
      icon: FileText, 
      label: 'Blog Manager', 
      path: '/admin/blogs',
      description: 'Content Management'
    },
    { 
      icon: Users, 
      label: 'Customers', 
      path: '/admin/customers',
      description: 'Customer Data'
    },
    { 
      icon: UserCheck, 
      label: 'Vendors', 
      path: '/admin/vendors',
      description: 'Vendor Management'
    },
    { 
      icon: Quote, 
      label: 'Quotations', 
      path: '/admin/quotations',
      description: 'Quote Management'
    },
    { 
      icon: BarChart3, 
      label: 'Requirements', 
      path: '/admin/requirements',
      description: 'Customer Requests'
    }
  ];

  return (
    <div className={cn(
      "bg-white border-r border-gray-200 h-screen flex flex-col transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <div>
            <h2 className="text-lg font-bold text-gray-900">PV Mart Admin</h2>
            <p className="text-xs text-gray-500">Control Panel</p>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-gray-100"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center p-3 rounded-lg transition-colors duration-200 group",
                    isActive 
                      ? "bg-blue-100 text-blue-700 border-r-2 border-blue-600" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={cn("flex-shrink-0", collapsed ? "w-5 h-5" : "w-5 h-5 mr-3")} />
                  {!collapsed && (
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{item.label}</div>
                      <div className="text-xs text-gray-500 truncate">{item.description}</div>
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        {!collapsed && (
          <div className="text-center">
            <p className="text-xs text-gray-500">PV Mart Admin Portal</p>
            <p className="text-xs text-gray-400">v1.0.0</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSidebar;
