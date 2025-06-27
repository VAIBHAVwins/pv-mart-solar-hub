
import { MapPin, Phone, Mail } from 'lucide-react';

const TopBar = () => {
  return (
    <div className="bg-solar-dark text-white py-2 hidden lg:block">
      <div className="container-responsive">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-solar-primary" />
              <span>123 Solar Street, Green City, India</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-solar-primary" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-solar-primary" />
              <span>info@pvmart.com</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span>Mon - Fri: 9:00 AM - 6:00 PM</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
