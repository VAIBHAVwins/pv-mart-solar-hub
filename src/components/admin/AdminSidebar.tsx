
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Image, 
  FileText, 
  UserCheck, 
  Building, 
  FileBarChart, 
  MessageSquare,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminSidebar = () => {
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Admin Users', href: '/admin/users', icon: Users },
    { name: 'Hero Banners', href: '/admin/banners', icon: Image },
    { name: 'Blog Manager', href: '/admin/blogs', icon: FileText },
    { name: 'Customers', href: '/admin/customers', icon: UserCheck },
    { name: 'Vendors', href: '/admin/vendors', icon: Building },
    { name: 'Quotations', href: '/admin/quotations', icon: FileBarChart },
    { name: 'Requirements', href: '/admin/requirements', icon: MessageSquare },
    { name: 'Appliance Manager', href: '/admin/appliances', icon: Zap },
  ];

  return (
    <div className="w-64 bg-white shadow-md h-screen sticky top-0">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
      </div>
      
      <nav className="mt-6">
        <div className="px-3">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <Icon
                  className={cn(
                    'mr-3 h-5 w-5 flex-shrink-0',
                    isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default AdminSidebar;
