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
  const [userType, setUserType] = useState<string | null>(null);
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
    }
  }, [user]);

  const fetchUserType = async () => {
    if (!user) return;
    
    try {
      // Check if user exists in customers table
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (customerError) {
        console.error('Error checking customer:', customerError);
      }

      if (customerData) {
        setUserType('customer');
        return;
      }

      // Check if user exists in vendors table
      const { data: vendorData, error: vendorError } = await supabase
        .from('vendors')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (vendorError) {
        console.error('Error checking vendor:', vendorError);
      }

      if (vendorData) {
        setUserType('vendor');
        return;
      }

      // Check if user has admin role
      const { data: adminRole, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (roleError) {
        console.error('Error checking admin role:', roleError);
      }

      if (adminRole) {
        setUserType('admin');
        return;
      }

      setUserType(null);
    } catch (error) {
      console.error('Error fetching user type:', error);
      setUserType(null);
    }
  };
  
  // Determine theme based on route
  function getThemeClasses() {
    if (isCustomerRoute) {
      return 'bg-jonquil text-licorice shadow-lg'; // Customer theme
    } else if (isVendorRoute) {
      return 'bg-vendor_gray text-seasalt shadow-lg'; // Vendor theme
    }
    return 'bg-white text-solar-dark shadow-solar'; // Default modern theme
  }

  function getLinkClasses() {
    if (isCustomerRoute) {
      return 'nav-link text-brown hover:text-licorice';
    } else if (isVendorRoute) {
      return 'nav-link text-seasalt hover:text-chamoisee';
    }
    return 'nav-link text-solar-dark hover:text-solar-primary';
  }

  async function handleLogout() {
    await signOut();
    navigate('/');
  }

  function handleDashboardClick() {
    if (userType === 'customer') {
      navigate('/customer/dashboard');
    } else if (userType === 'vendor') {
      navigate('/vendor/dashboard');
    } else if (userType === 'admin') {
      navigate('/admin/dashboard');
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
                  {userType === 'customer' ? 'Customer Dashboard' : userType === 'vendor' ? 'Vendor Dashboard' : 'Admin Dashboard'}
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
      {location.pathname === '/' && (
        <button
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={() => navigate('/admin/dashboard')}
        >
          PV MART
        </button>
      )}
    </>
  );
};

export default Header;
