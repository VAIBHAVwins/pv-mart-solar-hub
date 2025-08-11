
import { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface RegistrationSuccessPopupProps {
  userType: 'customer' | 'vendor';
  onRedirect: () => void;
}

export function RegistrationSuccessPopup({ userType, onRedirect }: RegistrationSuccessPopupProps) {
  useEffect(() => {
    // Auto redirect after 3 seconds
    const timer = setTimeout(() => {
      onRedirect();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onRedirect]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md mx-auto animate-scale-in">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-green-600">Registration Successful!</h2>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            Your {userType} account has been created successfully. You are now being redirected to your dashboard.
          </p>
          
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          
          <Button onClick={onRedirect} className="w-full">
            Go to Dashboard Now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
