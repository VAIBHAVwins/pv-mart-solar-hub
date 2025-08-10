
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const getLinkClasses = () => {
    return "nav-link text-brown hover:text-licorice";
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Sun className="h-8 w-8 text-solar-primary" />
              <span className="text-xl font-bold text-gray-900">PV Mart</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link to="/" className={getLinkClasses()}>
                Home
              </Link>
              <Link to="/about" className={getLinkClasses()}>
                About
              </Link>
              <Link to="/enhanced-game" className={getLinkClasses()}>
                Solar Game
              </Link>
              <Link to="/blogs" className={getLinkClasses()}>
                Blogs
              </Link>
              <Link to="/contact" className={getLinkClasses()}>
                Contact
              </Link>
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/customer/login">
              <Button variant="outline" size="sm">
                Customer Login
              </Button>
            </Link>
            <Link to="/vendor/login">
              <Button variant="outline" size="sm">
                Vendor Login
              </Button>
            </Link>
            <Link to="/mobile-auth">
              <Button size="sm" className="bg-solar-primary hover:bg-solar-dark">
                Quick Login
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              <Link
                to="/"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link
                to="/enhanced-game"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                Solar Game
              </Link>
              <Link
                to="/blogs"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                Blogs
              </Link>
              <Link
                to="/contact"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              
              {/* Mobile Auth Buttons */}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <Link to="/customer/login" className="block">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => setIsOpen(false)}>
                    Customer Login
                  </Button>
                </Link>
                <Link to="/vendor/login" className="block">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => setIsOpen(false)}>
                    Vendor Login
                  </Button>
                </Link>
                <Link to="/mobile-auth" className="block">
                  <Button size="sm" className="w-full bg-solar-primary hover:bg-solar-dark" onClick={() => setIsOpen(false)}>
                    Quick Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
