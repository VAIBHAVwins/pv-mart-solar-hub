
import { Button } from '@/components/ui/button';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate } from 'react-router-dom';

interface SkipAuthProps {
  targetPath: string;
  userType: 'customer' | 'vendor' | 'admin';
  className?: string;
}

const SkipAuth = ({ targetPath, userType, className = "" }: SkipAuthProps) => {
  const navigate = useNavigate();

  const handleSkipAuth = () => {
    // Store skip auth data in localStorage for demo purposes
    localStorage.setItem('skipAuth', 'true');
    localStorage.setItem('skipAuthUserType', userType);
    localStorage.setItem('skipAuthEmail', `demo-${userType}@pvmart.com`);
    
    // Navigate to target path
    navigate(targetPath);
    
    // Reload to trigger auth context update
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <Button 
      onClick={handleSkipAuth}
      variant="outline"
      className={`bg-yellow-500 hover:bg-yellow-600 text-black border-yellow-500 ${className}`}
    >
      🚀 Skip Auth (Demo Mode)
    </Button>
  );
};

export default SkipAuth;
