
import { Button } from '@/components/ui/button';
import SkipAuth from './SkipAuth';

interface AuthButtonsProps {
  user: { email?: string; id?: string } | null;
  handleLogout: () => void;
}

const AuthButtons = ({ user, handleLogout }: AuthButtonsProps) => {
  return (
    <div className="hidden lg:flex items-center space-x-4">
      {!user ? (
        <>
          <div className="flex flex-col space-y-2">
            <div className="flex space-x-2">
              <Button asChild variant="outline" className="solar-button-outline">
                <a href="/customer/login">Customer Login</a>
              </Button>
              <Button asChild variant="default" className="solar-button">
                <a href="/vendor/login">Vendor Login</a>
              </Button>
            </div>
            <div className="flex space-x-2">
              <SkipAuth targetPath="/customer/dashboard" userType="customer" className="text-xs px-2 py-1" />
              <SkipAuth targetPath="/vendor/dashboard" userType="vendor" className="text-xs px-2 py-1" />
              <SkipAuth targetPath="/admin/dashboard" userType="admin" className="text-xs px-2 py-1" />
            </div>
          </div>
        </>
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
