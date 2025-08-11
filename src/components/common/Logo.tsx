
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/admin/dashboard" className="flex items-center space-x-2">
      <img 
        src="/pvmart-logo.png" 
        alt="PVMart Logo" 
        className="h-8 w-auto"
      />
      <span className="text-2xl font-bold text-green-600 hidden sm:block">
        PVMart
      </span>
    </Link>
  );
};

export default Logo;
