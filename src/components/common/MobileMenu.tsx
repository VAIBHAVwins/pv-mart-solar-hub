
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';

interface MobileMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  getLinkClasses: () => string;
  user: any;
  userType: string | null;
  handleLogout: () => void;
  handleCustomerDashboardClick: () => void;
  handleVendorDashboardClick: () => void;
}

const MobileMenu = ({ 
  isMenuOpen, 
  setIsMenuOpen, 
  getLinkClasses, 
  user, 
  userType, 
  handleLogout,
  handleCustomerDashboardClick,
  handleVendorDashboardClick
}: MobileMenuProps) => {
  if (!isMenuOpen) return null;

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/installation-type', label: 'Installation Types' },
    { path: '/grid-connectivity', label: 'Grid Connectivity' },
    { path: '/blogs', label: 'Blog' },
    { path: '/contact', label: 'Contact' }
  ];

  return (
    <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-2xl border-t z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <nav className="flex flex-col space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium py-3 px-4 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          
          {/* User Section */}
          {user && (
            <div className="pt-4 border-t border-gray-200 mt-4">
              <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-lg mb-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{userType?.charAt(0).toUpperCase() + userType?.slice(1)}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              
              {userType === 'customer' && (
                <button
                  onClick={() => {
                    handleCustomerDashboardClick();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium rounded-lg mb-2"
                >
                  Customer Dashboard
                </button>
              )}
              
              {userType === 'vendor' && (
                <button
                  onClick={() => {
                    handleVendorDashboardClick();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium rounded-lg mb-2"
                >
                  Vendor Dashboard
                </button>
              )}
              
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 transition-colors font-medium rounded-lg"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log out
              </button>
            </div>
          )}
          
          {/* Auth Buttons */}
          {!user && (
            <div className="pt-4 border-t border-gray-200 mt-4 space-y-3">
              <Button asChild variant="outline" className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                <Link to="/customer/login" onClick={() => setIsMenuOpen(false)}>
                  Customer Login
                </Link>
              </Button>
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Link to="/vendor/login" onClick={() => setIsMenuOpen(false)}>
                  Vendor Login
                </Link>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;
