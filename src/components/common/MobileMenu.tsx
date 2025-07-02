import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface MobileMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  getLinkClasses: () => string;
  user: { email?: string; id?: string } | null;
  handleLogout: () => void;
}

const MobileMenu = ({ 
  isMenuOpen, 
  setIsMenuOpen, 
  getLinkClasses, 
  user, 
  handleLogout 
}: MobileMenuProps) => {
  if (!isMenuOpen) return null;

  return (
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
          {!user ? (
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
  );
};

export default MobileMenu;
