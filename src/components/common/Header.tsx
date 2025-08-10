
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Phone } from 'lucide-react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import Logo from './Logo';
import Navigation from './Navigation';
import MobileMenu from './MobileMenu';
import AuthButtons from './AuthButtons';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useSupabaseAuth();

  const handleCallNow = () => {
    window.open('tel:+918800000000', '_self');
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const getLinkClasses = () => {
    return "text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors";
  };

  const handleCustomerDashboardClick = () => {
    navigate('/customer/dashboard');
    closeMobileMenu();
  };

  const handleVendorDashboardClick = () => {
    navigate('/vendor/dashboard');
    closeMobileMenu();
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" onClick={closeMobileMenu}>
                <Logo />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <Navigation getLinkClasses={getLinkClasses} />
            </div>

            {/* Desktop Auth & Call Button */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                onClick={handleCallNow}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Call Now</span>
              </Button>
              <AuthButtons user={user} handleLogout={handleLogout} />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <Button
                onClick={handleCallNow}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg flex items-center space-x-1"
              >
                <Phone className="w-3 h-3" />
                <span className="text-xs">Call</span>
              </Button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu 
        isMenuOpen={isMobileMenuOpen}
        setIsMenuOpen={setIsMobileMenuOpen}
        getLinkClasses={getLinkClasses}
        user={user}
        userType={user?.user_metadata?.user_type || null}
        handleCustomerDashboardClick={handleCustomerDashboardClick}
        handleVendorDashboardClick={handleVendorDashboardClick}
      />
    </>
  );
};

export default Header;
