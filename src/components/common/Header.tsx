
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import Navigation from './Navigation';
import AuthButtons from './AuthButtons';
import MobileMenu from './MobileMenu';
import { supabase } from '@/integrations/supabase/client';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ email?: string; id?: string } | null>(null);
  const location = useLocation();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const getLinkClasses = () => 
    'px-4 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium';

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Centered Navigation */}
          <div className="flex-1 flex justify-center">
            <Navigation getLinkClasses={getLinkClasses} />
          </div>

          {/* Auth Buttons */}
          <div className="flex-shrink-0">
            <div className="hidden lg:flex items-center space-x-4">
              {!user ? (
                <div className="flex space-x-2">
                  <Link 
                    to="/customer/login"
                    className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors font-medium"
                  >
                    Customer Login
                  </Link>
                  <Link 
                    to="/vendor/login"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                  >
                    Vendor Login
                  </Link>
                </div>
              ) : (
                <button
                  className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors font-medium"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        user={user}
        handleLogout={handleLogout}
      />
    </header>
  );
};

export default Header;
