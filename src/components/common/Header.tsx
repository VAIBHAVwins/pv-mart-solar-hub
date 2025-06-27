import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Phone, Mail, MapPin } from 'lucide-react';
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
      return 'bg-jonquil text-licorice shadow-lg'; // Customer theme
    } else if (isVendorRoute) {
      return 'bg-vendor_gray text-seasalt shadow-lg'; // Vendor theme
    }
    return 'bg-white text-solar-dark shadow-solar'; // Default modern theme
  };

  const getLinkClasses = () => {
    if (isCustomerRoute) {
      return 'nav-link text-brown hover:text-licorice';
    } else if (isVendorRoute) {
      return 'nav-link text-seasalt hover:text-chamoisee';
    }
    return 'nav-link text-solar-dark hover:text-solar-primary';
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
    <>
      {/* Top Bar */}
      <div className="bg-solar-dark text-white py-2 hidden lg:block">
        <div className="container-responsive">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-solar-primary" />
                <span>123 Solar Street, Green City, India</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-solar-primary" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-solar-primary" />
                <span>info@pvmart.com</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span>Mon - Fri: 9:00 AM - 6:00 PM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`${getThemeClasses()} sticky top-0 z-50 transition-all duration-300`}>
        <div className="container-responsive">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <img src="/pvmart-logo.png" alt="PVMART Logo" className="h-12 w-12 object-contain transition-transform group-hover:scale-110" />
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold text-solar-primary">PV Mart</h1>
                <p className="text-xs text-gray-600">Solar Solutions</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link to="/" className={getLinkClasses()}>
                Home
              </Link>
              <Link to="/about" className={getLinkClasses()}>
                About
              </Link>
              <Link to="/blogs" className={getLinkClasses()}>
                Blogs
              </Link>
              <Link to="/contact" className={getLinkClasses()}>
                Contact
              </Link>
              <Link to="/game" className={getLinkClasses()}>
                Game
              </Link>
            </nav>

            {/* Desktop Auth Buttons or Logout */}
            <div className="hidden lg:flex items-center space-x-4">
              {isAdmin ? (
                <Button 
                  onClick={handleLogout} 
                  className="solar-button-outline border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  Logout
                </Button>
              ) : !user ? (
                <>
                  <Link to="/customer/login">
                    <Button className="solar-button-outline">
                      Customer Login
                    </Button>
                  </Link>
                  <Link to="/vendor/login">
                    <Button className="solar-button">
                      Vendor Login
                    </Button>
                  </Link>
                </>
              ) : (
                <Button 
                  onClick={handleLogout} 
                  className="solar-button-outline border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  Logout
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-200 animate-fade-in">
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
                <Link 
                  to="/game" 
                  className={getLinkClasses()}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Game
                </Link>
                
                <div className="pt-4 border-t border-gray-200">
                  {isAdmin ? (
                    <Button 
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }} 
                      className="w-full solar-button-outline border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      Logout
                    </Button>
                  ) : !user ? (
                    <div className="flex flex-col space-y-3">
                      <Link to="/customer/login">
                        <Button 
                          className="w-full solar-button-outline"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Customer Login
                        </Button>
                      </Link>
                      <Link to="/vendor/login">
                        <Button 
                          className="w-full solar-button"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Vendor Login
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }} 
                      className="w-full solar-button-outline border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      Logout
                    </Button>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
