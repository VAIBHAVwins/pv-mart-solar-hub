
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const TopBar = () => {
  return (
    <div className="bg-gray-900 text-gray-300 py-2 hidden lg:block border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2 hover:text-white transition-colors">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span>123 Solar Street, Green City, India</span>
            </div>
            <div className="flex items-center space-x-2 hover:text-white transition-colors">
              <Phone className="w-4 h-4 text-blue-400" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center space-x-2 hover:text-white transition-colors">
              <Mail className="w-4 h-4 text-blue-400" />
              <span>info@pvmart.com</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <Clock className="w-4 h-4 text-blue-400" />
            <span>Mon - Fri: 9:00 AM - 6:00 PM</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
