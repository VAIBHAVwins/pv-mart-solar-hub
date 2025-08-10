
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-solar-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">PV</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-solar-dark leading-none">PV Mart</span>
              <span className="text-xs text-gray-600 leading-none">Solar Solutions</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-solar-primary transition-colors font-medium">
              Home
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-solar-primary transition-colors font-medium">
              About
            </Link>
            <Link to="/blogs" className="text-gray-700 hover:text-solar-primary transition-colors font-medium">
              Blog
            </Link>
            <Link to="/game" className="text-gray-700 hover:text-solar-primary transition-colors font-medium">
              Solar Game
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-solar-primary transition-colors font-medium">
              Contact
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link to="/customer/login">
              <Button variant="outline" size="sm" className="border-solar-primary text-solar-primary hover:bg-solar-primary hover:text-white">
                Customer Login
              </Button>
            </Link>
            <Link to="/vendor/login">
              <Button size="sm" className="bg-solar-primary hover:bg-solar-secondary text-white">
                Vendor Login
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-solar-primary transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="text-gray-700 hover:text-solar-primary transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/blogs" 
                className="text-gray-700 hover:text-solar-primary transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link 
                to="/game" 
                className="text-gray-700 hover:text-solar-primary transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Solar Game
              </Link>
              <Link 
                to="/contact" 
                className="text-gray-700 hover:text-solar-primary transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                <Link to="/customer/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full border-solar-primary text-solar-primary hover:bg-solar-primary hover:text-white">
                    Customer Login
                  </Button>
                </Link>
                <Link to="/vendor/login" onClick={() => setIsMenuOpen(false)}>
                  <Button size="sm" className="w-full bg-solar-primary hover:bg-solar-secondary text-white">
                    Vendor Login
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
