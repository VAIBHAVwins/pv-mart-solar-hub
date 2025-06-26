import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isCustomerRoute = location.pathname.includes('/customer');
  const isVendorRoute = location.pathname.includes('/vendor');
  
  // Determine theme based on route
  const getThemeClasses = () => {
    if (isCustomerRoute) {
      return 'bg-jonquil text-licorice'; // Customer theme
    } else if (isVendorRoute) {
      return 'bg-vendor_gray text-seasalt'; // Vendor theme
    }
    return 'bg-cornflower_blue text-white'; // Default theme
  };

  const getLinkClasses = () => {
    if (isCustomerRoute) {
      return 'text-brown hover:text-licorice';
    } else if (isVendorRoute) {
      return 'text-seasalt hover:text-chamoisee';
    }
    return 'text-white hover:text-cornflower_blue-200';
  };

  return (
    <header className={`${getThemeClasses()} shadow-lg sticky top-0 z-50`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            PV_MART
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className={`${getLinkClasses()} transition-colors`}>
              Home
            </Link>
            <Link to="/about" className={`${getLinkClasses()} transition-colors`}>
              About
            </Link>
            <Link to="/blogs" className={`${getLinkClasses()} transition-colors`}>
              Blogs
            </Link>
            <Link to="/contact" className={`${getLinkClasses()} transition-colors`}>
              Contact
            </Link>
            <Link to="/game" className={`${getLinkClasses()} transition-colors`}>
              Game
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            <Link to="/customer/login">
              <Button
                variant={isCustomerRoute ? 'outline' : 'default'}
                size="sm"
                className={
                  isCustomerRoute
                    ? 'border-brown text-brown hover:bg-brown hover:text-white px-3 py-1 text-xs'
                    : 'bg-brown text-white hover:bg-brown-600 border-none px-3 py-1 text-xs'
                }
              >
                Customer Login
              </Button>
            </Link>
            <Link to="/vendor/login">
              <Button
                variant={isVendorRoute ? 'outline' : 'default'}
                size="sm"
                className={
                  isVendorRoute
                    ? 'border-chamoisee text-chamoisee hover:bg-chamoisee hover:text-white px-3 py-1 text-xs'
                    : 'bg-chamoisee text-white hover:bg-chamoisee-600 border-none px-3 py-1 text-xs'
                }
              >
                Vendor Login
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-3 animate-fade-in">
            <Link to="/" className={`block ${getLinkClasses()} transition-colors`}>
              Home
            </Link>
            <Link to="/about" className={`block ${getLinkClasses()} transition-colors`}>
              About
            </Link>
            <Link to="/blogs" className={`block ${getLinkClasses()} transition-colors`}>
              Blogs
            </Link>
            <Link to="/contact" className={`block ${getLinkClasses()} transition-colors`}>
              Contact
            </Link>
            <Link to="/game" className={`block ${getLinkClasses()} transition-colors`}>
              Game
            </Link>
            <div className="flex flex-col space-y-2 pt-3">
              <Link to="/customer/login">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Customer Login
                </Button>
              </Link>
              <Link to="/vendor/login">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Vendor Login
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
