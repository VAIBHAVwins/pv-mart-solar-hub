
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import TopBar from './TopBar';
import Logo from './Logo';
import Navigation from './Navigation';
import MobileMenu from './MobileMenu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userRole } = useSupabaseAuth();

  const isCustomerRoute = location.pathname.includes('/customer');
  const isVendorRoute = location.pathname.includes('/vendor');
  
  const getThemeClasses = () => {
    if (isCustomerRoute) {
      return 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-xl border-b border-blue-800';
    } else if (isVendorRoute) {
      return 'bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-xl border-b border-gray-700';
    }
    return 'bg-white/95 backdrop-blur-md text-gray-900 shadow-lg border-b border-gray-200';
  };

  const getLinkClasses = () => {
    if (isCustomerRoute) {
      return 'text-blue-100 hover:text-white font-medium transition-colors duration-200 hover:bg-blue-600/20 px-3 py-2 rounded-md';
    } else if (isVendorRoute) {
      return 'text-gray-300 hover:text-white font-medium transition-colors duration-200 hover:bg-gray-700/50 px-3 py-2 rounded-md';
    }
    return 'text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 hover:bg-gray-50 px-3 py-2 rounded-md';
  };

  const handleCustomerDashboardClick = () => {
    navigate('/customer/dashboard');
  };

  const handleVendorDashboardClick = () => {
    navigate('/vendor/dashboard');
  };

  const getUserInitials = () => {
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <>
      <TopBar />
      
      <header className={`${getThemeClasses()} sticky top-0 z-50 transition-all duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo />
            
            <Navigation getLinkClasses={getLinkClasses} />
            
            <div className="flex items-center space-x-4">
              {/* Dashboard buttons - only visible when logged in */}
              {user && userRole === 'customer' && (
                <Button
                  onClick={handleCustomerDashboardClick}
                  variant="outline"
                  size="sm"
                  className="hidden lg:flex bg-white/10 border-white/20 text-white hover:bg-white hover:text-blue-600 font-medium"
                >
                  Dashboard
                </Button>
              )}
              
              {user && userRole === 'vendor' && (
                <Button
                  onClick={handleVendorDashboardClick}
                  variant="outline"
                  size="sm"
                  className="hidden lg:flex bg-white/10 border-white/20 text-white hover:bg-white hover:text-gray-800 font-medium"
                >
                  Dashboard
                </Button>
              )}
              
              {/* User Menu */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:bg-white/10">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-white/20 text-white text-sm font-semibold">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{userRole?.charAt(0).toUpperCase() + userRole?.slice(1)}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={userRole === 'customer' ? handleCustomerDashboardClick : handleVendorDashboardClick}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden lg:flex items-center space-x-3">
                  <Button 
                    asChild 
                    size="sm" 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <a href="/customer/login">Customer Login</a>
                  </Button>
                  <Button 
                    asChild 
                    size="sm" 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <a href="/vendor/login">Vendor Login</a>
                  </Button>
                </div>
              )}
            </div>

            <button
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
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
            handleCustomerDashboardClick={handleCustomerDashboardClick}
            handleVendorDashboardClick={handleVendorDashboardClick}
          />
        </div>
      </header>
    </>
  );
};

export default Header;
