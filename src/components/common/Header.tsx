import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(!!localStorage.getItem('adminAuth'));
  }, [location]);

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

  const handleLogout = async () => {
    if (isAdmin) {
      localStorage.removeItem('adminAuth');
      setIsAdmin(false);
      navigate('/admin/login');
    } else {
      await logout();
      navigate('/');
    }
  };

  return (
    <header className={`${getThemeClasses()} shadow-lg sticky top-0 z-50`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/pvmart-logo.png" alt="PVMART Logo" className="h-12 w-12 object-contain" />
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

          {/* Desktop Auth Buttons or Logout */}
          <div className="hidden md:flex items-center space-x-2">
            {isAdmin ? (
              <Button onClick={handleLogout} size="sm" className="bg-red-600 text-white px-3 py-1 text-xs hover:bg-red-700">
                Logout
              </Button>
            ) : !user ? (
              <>
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
              </>
            ) : (
              <Button onClick={handleLogout} size="sm" className="bg-red-600 text-white px-3 py-1 text-xs hover:bg-red-700">
                Logout
              </Button>
            )}
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
              {isAdmin ? (
                <Button onClick={handleLogout} size="sm" className="w-full text-xs bg-red-600 text-white hover:bg-red-700">
                  Logout
                </Button>
              ) : !user ? (
                <>
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
                </>
              ) : (
                <Button onClick={handleLogout} size="sm" className="w-full text-xs bg-red-600 text-white hover:bg-red-700">
                  Logout
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
