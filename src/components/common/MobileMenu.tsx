
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, Calculator } from 'lucide-react';

interface MobileMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  getLinkClasses: () => string;
  user: any;
  userType: string | null;
  handleCustomerDashboardClick: () => void;
  handleVendorDashboardClick: () => void;
}

const MobileMenu = ({ 
  isMenuOpen, 
  setIsMenuOpen, 
  getLinkClasses, 
  user, 
  userType,
  handleCustomerDashboardClick,
  handleVendorDashboardClick
}: MobileMenuProps) => {
  if (!isMenuOpen) return null;

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/blogs', label: 'Blog' },
    { path: '/contact', label: 'Contact' }
  ];

  return (
    <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg">
      <div className="px-4 py-6 space-y-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`${getLinkClasses()} block text-center`}
            onClick={() => setIsMenuOpen(false)}
          >
            {item.label}
          </Link>
        ))}
        
        {/* Tools Menu */}
        <div className="pt-2 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Tools</h3>
          <Link
            to="/tools/load-calculation"
            className={`${getLinkClasses()} block text-center flex items-center justify-center gap-2`}
            onClick={() => setIsMenuOpen(false)}
          >
            <Calculator className="w-4 h-4" />
            Load Calculation
          </Link>
        </div>
        
        {user ? (
          <div className="pt-4 border-t border-gray-200">
            <Button
              onClick={userType === 'customer' ? handleCustomerDashboardClick : handleVendorDashboardClick}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              <User className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </div>
        ) : (
          <div className="pt-4 border-t border-gray-200 space-y-3">
            <Button 
              asChild 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              <a href="/customer/dashboard">Customer Dashboard</a>
            </Button>
            <Button 
              asChild 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              <a href="/vendor/dashboard">Vendor Dashboard</a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
