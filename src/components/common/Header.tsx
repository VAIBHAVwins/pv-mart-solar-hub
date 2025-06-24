
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
      return 'bg-[#fecb00] text-[#190a02]'; // Customer theme
    } else if (isVendorRoute) {
      return 'bg-[#797a83] text-[#f7f7f6]'; // Vendor theme
    }
    return 'bg-[#589bee] text-white'; // Default theme
  };

  const getLinkClasses = () => {
    if (isCustomerRoute) {
      return 'text-[#8b4a08] hover:text-[#3d1604]';
    } else if (isVendorRoute) {
      return 'text-[#f7f7f6] hover:text-[#d2cec8]';
    }
    return 'text-white hover:text-[#deebfc]';
  };

  return (
    <header className={`${getThemeClasses()} shadow-lg`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            PVMart
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className={`${getLinkClasses()} transition-colors`}>
              Home
            </Link>
            <Link to="/about" className={`${getLinkClasses()} transition-colors`}>
              About
            </Link>
            <Link to="/blog" className={`${getLinkClasses()} transition-colors`}>
              Blog
            </Link>
            <Link to="/contact" className={`${getLinkClasses()} transition-colors`}>
              Contact
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link to="/customer/login">
              <Button variant="outline" size="sm" className={isCustomerRoute ? 'border-[#8b4a08] text-[#8b4a08] hover:bg-[#8b4a08] hover:text-white' : ''}>
                Customer Login
              </Button>
            </Link>
            <Link to="/vendor/login">
              <Button variant="outline" size="sm" className={isVendorRoute ? 'border-[#b07e66] text-[#b07e66] hover:bg-[#b07e66] hover:text-white' : ''}>
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
          <div className="md:hidden mt-4 space-y-3">
            <Link to="/" className={`block ${getLinkClasses()} transition-colors`}>
              Home
            </Link>
            <Link to="/about" className={`block ${getLinkClasses()} transition-colors`}>
              About
            </Link>
            <Link to="/blog" className={`block ${getLinkClasses()} transition-colors`}>
              Blog
            </Link>
            <Link to="/contact" className={`block ${getLinkClasses()} transition-colors`}>
              Contact
            </Link>
            <div className="flex flex-col space-y-2 pt-3">
              <Link to="/customer/login">
                <Button variant="outline" size="sm" className="w-full">
                  Customer Login
                </Button>
              </Link>
              <Link to="/vendor/login">
                <Button variant="outline" size="sm" className="w-full">
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
