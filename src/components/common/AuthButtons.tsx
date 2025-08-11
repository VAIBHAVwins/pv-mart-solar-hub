
import { Button } from '@/components/ui/button';

interface AuthButtonsProps {
  user: { email?: string; id?: string } | null;
  handleLogout: () => void;
}

const AuthButtons = ({ user, handleLogout }: AuthButtonsProps) => {
  return (
    <div className="hidden lg:flex items-center space-x-4">
      {!user ? (
        <div className="flex space-x-2">
          <Button asChild variant="outline" className="solar-button-outline">
            <a href="/customer/dashboard">Customer Dashboard</a>
          </Button>
          <Button asChild variant="default" className="solar-button">
            <a href="/vendor/dashboard">Vendor Dashboard</a>
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          className="solar-button-outline border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
          onClick={handleLogout}
        >
          Logout
        </Button>
      )}
    </div>
  );
};

export default AuthButtons;
