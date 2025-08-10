
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Smartphone } from 'lucide-react';

interface AuthMethodSelectorProps {
  onMethodSelect: (method: 'email' | 'phone') => void;
  userType: 'customer' | 'vendor';
}

const AuthMethodSelector = ({ onMethodSelect, userType }: AuthMethodSelectorProps) => {
  const typeColors = {
    customer: {
      primary: 'blue',
      secondary: 'green'
    },
    vendor: {
      primary: 'orange',
      secondary: 'red'
    }
  };

  const colors = typeColors[userType];

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold text-gray-900">
          Choose Login Method
        </CardTitle>
        <CardDescription className="text-gray-600">
          How would you like to {userType === 'customer' ? 'access your customer' : 'access your vendor'} account?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-6 pb-6">
        <Button
          onClick={() => onMethodSelect('email')}
          className={`w-full h-20 text-left flex items-center space-x-4 bg-white hover:bg-${colors.primary}-50 border-2 border-gray-200 hover:border-${colors.primary}-300 transition-all duration-200 shadow-sm hover:shadow-md group`}
          variant="outline"
        >
          <div className={`w-14 h-14 bg-${colors.primary}-100 rounded-full flex items-center justify-center group-hover:bg-${colors.primary}-200 transition-colors duration-200`}>
            <Mail className={`w-7 h-7 text-${colors.primary}-600`} />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900 text-lg">Email & Password</div>
            <div className="text-sm text-gray-600 mt-1">Login with your registered email address</div>
          </div>
        </Button>

        <Button
          onClick={() => onMethodSelect('phone')}
          className={`w-full h-20 text-left flex items-center space-x-4 bg-white hover:bg-${colors.secondary}-50 border-2 border-gray-200 hover:border-${colors.secondary}-300 transition-all duration-200 shadow-sm hover:shadow-md group`}
          variant="outline"
        >
          <div className={`w-14 h-14 bg-${colors.secondary}-100 rounded-full flex items-center justify-center group-hover:bg-${colors.secondary}-200 transition-colors duration-200`}>
            <Smartphone className={`w-7 h-7 text-${colors.secondary}-600`} />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900 text-lg">Phone & Password</div>
            <div className="text-sm text-gray-600 mt-1">Login with your mobile number and password</div>
          </div>
        </Button>
      </CardContent>
    </Card>
  );
};

export default AuthMethodSelector;
