
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Smartphone } from 'lucide-react';

interface AuthMethodSelectorProps {
  onMethodSelect: (method: 'email' | 'phone') => void;
  userType: 'customer' | 'vendor';
}

const AuthMethodSelector = ({ onMethodSelect, userType }: AuthMethodSelectorProps) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          Choose Login Method
        </CardTitle>
        <CardDescription>
          How would you like to {userType === 'customer' ? 'access your customer' : 'access your vendor'} account?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={() => onMethodSelect('email')}
          className="w-full h-16 text-left flex items-center space-x-4 hover:bg-blue-50 border-2 border-transparent hover:border-blue-200"
          variant="outline"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">Email & Password</div>
            <div className="text-sm text-gray-600">Login with your registered email</div>
          </div>
        </Button>

        <Button
          onClick={() => onMethodSelect('phone')}
          className="w-full h-16 text-left flex items-center space-x-4 hover:bg-green-50 border-2 border-transparent hover:border-green-200"
          variant="outline"
        >
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <Smartphone className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">Phone & Password</div>
            <div className="text-sm text-gray-600">Login with your mobile number and password</div>
          </div>
        </Button>
      </CardContent>
    </Card>
  );
};

export default AuthMethodSelector;
