
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

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

  return (
    <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t z-40">
      <div className="container-responsive py-4">
        <nav className="flex flex-col space-y-4">
          <Link 
            to="/" 
            className={getLinkClasses()}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className={getLinkClasses()}
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          <Link 
            to="/blogs" 
            className={getLinkClasses()}
            onClick={() => setIsMenuOpen(false)}
          >
            Blogs
          </Link>
          <Link 
            to="/contact" 
            className={getLinkClasses()}
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
          
          {/* Dashboard buttons for mobile */}
          {user && userType === 'customer' && (
            <button
              onClick={() => {
                handleCustomerDashboardClick();
                setIsMenuOpen(false);
              }}
              className="text-left solar-button-outline px-4 py-2 text-sm font-semibold"
            >
              Customer Dashboard
            </button>
          )}
          
          {user && userType === 'vendor' && (
            <button
              onClick={() => {
                handleVendorDashboardClick();
                setIsMenuOpen(false);
              }}
              className="text-left solar-button-outline px-4 py-2 text-sm font-semibold"
            >
              Vendor Dashboard
            </button>
          )}
          
          <div className="pt-4 border-t">
            {!user ? (
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full solar-button-outline">
                  <Link to="/customer/login" onClick={() => setIsMenuOpen(false)}>
                    Customer Login
                  </Link>
                </Button>
                <Button asChild variant="default" className="w-full solar-button">
                  <Link to="/vendor/login" onClick={() => setIsMenuOpen(false)}>
                    Vendor Login
                  </Link>
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full solar-button-outline border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
              >
                Logout
              </Button>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;
