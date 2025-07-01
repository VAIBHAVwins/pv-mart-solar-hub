import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface AuthButtonsProps {
  isAdmin: boolean;
  user: { email?: string; id?: string } | null;
  handleLogout: () => void;
}

const AuthButtons = ({ isAdmin, user, handleLogout }: AuthButtonsProps) => {
  return (
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
  );
};

export default AuthButtons;
