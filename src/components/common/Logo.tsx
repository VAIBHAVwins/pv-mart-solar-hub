
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center space-x-3 group">
      <div className="relative">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
          <Zap className="w-6 h-6 text-white" fill="currentColor" />
        </div>
      </div>
      <div className="hidden sm:block">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          PV Mart
        </h1>
        <p className="text-xs text-gray-500 font-medium">Solar Solutions</p>
      </div>
    </Link>
  );
};

export default Logo;
