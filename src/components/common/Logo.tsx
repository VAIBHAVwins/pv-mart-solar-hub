
import { Link, useLocation } from 'react-router-dom';

interface LogoProps {
  className?: string;
  textColor?: 'adaptive' | 'white' | 'black';
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ className = '', textColor = 'adaptive', size = 'md' }: LogoProps) => {
  const location = useLocation();
  
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  const getTextColorClass = () => {
    const isCustomerRoute = location.pathname.includes('/customer');
    const isVendorRoute = location.pathname.includes('/vendor');
    
    if (textColor === 'white') {
      return 'text-white';
    }
    
    if (textColor === 'black') {
      return 'text-black';
    }
    
    // Adaptive mode - check route-based background
    if (isCustomerRoute || isVendorRoute) {
      return 'text-white';
    }
    
    // Default homepage/other pages
    return 'text-gray-900';
  };

  return (
    <Link to="/" className={`flex items-center space-x-2 ${className}`}>
      <img 
        src="/pvmart-logo.png" 
        alt="PV Mart Logo" 
        className="h-8 w-8 object-contain"
      />
      <span className={`font-bold ${sizeClasses[size]} ${getTextColorClass()}`}>
        PV Mart Solar Solutions
      </span>
    </Link>
  );
};

export default Logo;
