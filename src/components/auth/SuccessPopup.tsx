
import { useEffect, useState } from 'react';
import { CheckCircle, Mail } from 'lucide-react';

interface SuccessPopupProps {
  email: string;
  userType: 'customer' | 'vendor';
  onClose: () => void;
}

export function SuccessPopup({ email, userType, onClose }: SuccessPopupProps) {
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-fade-in">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Registration Successful!
          </h2>
        </div>
        
        <div className="mb-6">
          <Mail className="w-8 h-8 text-blue-500 mx-auto mb-3" />
          <p className="text-gray-600 leading-relaxed">
            We have sent you a verification email to
          </p>
          <p className="font-semibold text-gray-800 mt-1 break-words">
            {email}
          </p>
        </div>

        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white p-4 rounded-lg mb-6">
          <p className="font-medium">
            Kindly verify your email and start your solar journey!
          </p>
        </div>

        <div className="text-sm text-gray-500 mb-4">
          Redirecting to home page in {countdown} seconds...
        </div>

        <button
          onClick={onClose}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
        >
          Close Now
        </button>
      </div>
    </div>
  );
}
