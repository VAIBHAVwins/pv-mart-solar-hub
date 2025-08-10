
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Smartphone } from 'lucide-react';

interface AuthMethodSelectorProps {
  onMethodSelect: (method: 'email' | 'phone') => void;
  userType: 'customer' | 'vendor';
}

const AuthMethodSelector = ({ onMethodSelect, userType }: AuthMethodSelectorProps) => {
  const getThemeColors = () => {
    if (userType === 'customer') {
      return {
        emailBg: 'bg-blue-50',
        emailBorder: 'border-blue-200',
        emailHoverBg: 'hover:bg-blue-100',
        emailHoverBorder: 'hover:border-blue-300',
        emailIconBg: 'bg-blue-100',
        emailIconColor: 'text-blue-600',
        phoneBg: 'bg-green-50',
        phoneBorder: 'border-green-200',
        phoneHoverBg: 'hover:bg-green-100',
        phoneHoverBorder: 'hover:border-green-300',
        phoneIconBg: 'bg-green-100',
        phoneIconColor: 'text-green-600'
      };
    } else {
      return {
        emailBg: 'bg-orange-50',
        emailBorder: 'border-orange-200',
        emailHoverBg: 'hover:bg-orange-100',
        emailHoverBorder: 'hover:border-orange-300',
        emailIconBg: 'bg-orange-100',
        emailIconColor: 'text-orange-600',
        phoneBg: 'bg-red-50',
        phoneBorder: 'border-red-200',
        phoneHoverBg: 'hover:bg-red-100',
        phoneHoverBorder: 'hover:border-red-300',
        phoneIconBg: 'bg-red-100',
        phoneIconColor: 'text-red-600'
      };
    }
  };

  const colors = getThemeColors();

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl border-2">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold text-gray-900">
          Choose Login Method
        </CardTitle>
        <CardDescription className="text-gray-600">
          How would you like to access your {userType} account?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-6 pb-6">
        <Button
          onClick={() => onMethodSelect('email')}
          className={`w-full h-20 text-left flex items-center space-x-4 ${colors.emailBg} ${colors.emailHoverBg} border-2 ${colors.emailBorder} ${colors.emailHoverBorder} transition-all duration-200 shadow-sm hover:shadow-md group text-gray-900`}
          variant="outline"
        >
          <div className={`w-14 h-14 ${colors.emailIconBg} rounded-full flex items-center justify-center transition-colors duration-200`}>
            <Mail className={`w-6 h-6 ${colors.emailIconColor}`} />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900 text-lg">Email & Password</div>
            <div className="text-sm text-gray-600 mt-1">Login with your registered email address</div>
          </div>
        </Button>

        <Button
          onClick={() => onMethodSelect('phone')}
          className={`w-full h-20 text-left flex items-center space-x-4 ${colors.phoneBg} ${colors.phoneHoverBg} border-2 ${colors.phoneBorder} ${colors.phoneHoverBorder} transition-all duration-200 shadow-sm hover:shadow-md group text-gray-900`}
          variant="outline"
        >
          <div className={`w-14 h-14 ${colors.phoneIconBg} rounded-full flex items-center justify-center transition-colors duration-200`}>
            <Smartphone className={`w-6 h-6 ${colors.phoneIconColor}`} />
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
