
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';
import TopBar from './TopBar';
import Logo from './Logo';
import Navigation from './Navigation';
import AuthButtons from './AuthButtons';
import MobileMenu from './MobileMenu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userType, setUserType] = useState<string | null>(() => {
    // Try to get userType from localStorage for instant rendering
    return localStorage.getItem('userType');
  });
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useSupabaseAuth();

  const isCustomerRoute = location.pathname.includes('/customer');
  const isVendorRoute = location.pathname.includes('/vendor');
  
  // Fetch user type when user changes
  useEffect(() => {
    if (user) {
      fetchUserType();
    } else {
      setUserType(null);
      localStorage.removeItem('userType');
    }
  }, [user]);

  const fetchUserType = async () => {
    if (!user) return;
    // Check in customers table
    const { data: customer } = await supabase
      .from('customers')
      .select('id')
      .eq('id', user.id)
      .single();
    if (customer) {
      setUserType('customer');
      localStorage.setItem('userType', 'customer');
      return;
    }
    // Check in vendors table
    const { data: vendor } = await supabase
      .from('vendors')
      .select('id')
      .eq('id', user.id)
      .single();
    if (vendor) {
      setUserType('vendor');
      localStorage.setItem('userType', 'vendor');
      return;
    }
    setUserType(null);
    localStorage.removeItem('userType');
  };
  
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
    await signOut();
    localStorage.removeItem('userType');
    navigate('/');
  };

  const handleDashboardClick = () => {
    if (userType === 'customer') {
      navigate('/customer/dashboard');
    } else if (userType === 'vendor') {
      navigate('/vendor/dashboard');
    }
  };

  return (
    <>
      <TopBar />
      
      {/* Main Header */}
      <header className={`${getThemeClasses()} sticky top-0 z-50 transition-all duration-300`}>
        <div className="container-responsive">
          <div className="flex items-center justify-between py-4">
            <Logo />
            
            <Navigation getLinkClasses={getLinkClasses} />
            
            <div className="flex items-center space-x-4">
              {/* Dashboard Button for logged-in users - Fixed to show correct dashboard */}
              {user && userType && (
                <button
                  onClick={handleDashboardClick}
                  className="hidden lg:block solar-button-outline px-4 py-2 text-sm"
                >
                  {userType === 'customer' ? 'Customer Dashboard' : 'Vendor Dashboard'}
                </button>
              )}
              
              <AuthButtons 
                user={user} 
                handleLogout={handleLogout} 
              />
            </div>

            {/* Mobile Menu Button */}
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
            userType={userType}
            handleLogout={handleLogout}
            handleDashboardClick={handleDashboardClick}
          />
        </div>
      </header>
    </>
  );
};

export default Header;
