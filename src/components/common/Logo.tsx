
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  textColor?: 'adaptive' | 'white' | 'black';
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ className = '', textColor = 'adaptive', size = 'md' }: LogoProps) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  const getTextColorClass = () => {
    switch (textColor) {
      case 'white':
        return 'text-white';
      case 'black':
        return 'text-black';
      case 'adaptive':
      default:
        return 'text-white drop-shadow-lg [text-shadow:1px_1px_2px_rgba(0,0,0,0.8)] contrast-more:text-black contrast-more:drop-shadow-none contrast-more:[text-shadow:none]';
    }
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
