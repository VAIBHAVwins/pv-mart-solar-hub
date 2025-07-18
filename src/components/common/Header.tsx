
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import TopBar from './TopBar';
import Logo from './Logo';
import Navigation from './Navigation';
import AuthButtons from './AuthButtons';
import MobileMenu from './MobileMenu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userRole, signOut } = useSupabaseAuth();

  const isCustomerRoute = location.pathname.includes('/customer');
  const isVendorRoute = location.pathname.includes('/vendor');
  
  const getThemeClasses = () => {
    if (isCustomerRoute) {
      return 'bg-jonquil text-licorice shadow-lg';
    } else if (isVendorRoute) {
      return 'bg-vendor_gray text-seasalt shadow-lg';
    }
    return 'bg-white text-solar-dark shadow-solar';
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
    await signOut();
    navigate('/');
  };

  const handleDashboardClick = () => {
    if (userRole === 'customer') {
      navigate('/customer/dashboard');
    } else if (userRole === 'vendor') {
      navigate('/vendor/dashboard');
    }
  };

  return (
    <>
      <TopBar />
      
      <header className={`${getThemeClasses()} sticky top-0 z-50 transition-all duration-300`}>
        <div className="container-responsive">
          <div className="flex items-center justify-between py-4">
            <Logo />
            
            <Navigation getLinkClasses={getLinkClasses} />
            
            <div className="flex items-center space-x-4">
              {user && userRole && (
                <button
                  onClick={handleDashboardClick}
                  className="hidden lg:block solar-button-outline px-4 py-2 text-sm"
                >
                  {userRole === 'customer' ? 'Customer Dashboard' : 'Vendor Dashboard'}
                </button>
              )}
              
              <AuthButtons 
                user={user} 
                handleLogout={handleLogout} 
              />
            </div>

            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <MobileMenu 
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            getLinkClasses={getLinkClasses}
            user={user}
            userType={userRole}
            handleLogout={handleLogout}
            handleDashboardClick={handleDashboardClick}
          />
        </div>
      </header>
    </>
  );
};

export default Header;
