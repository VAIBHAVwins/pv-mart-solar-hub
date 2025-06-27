
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center space-x-3 group">
      <img src="/pvmart-logo.png" alt="PVMART Logo" className="h-12 w-12 object-contain transition-transform group-hover:scale-110" />
      <div className="hidden sm:block">
        <h1 className="text-2xl font-bold text-solar-primary">PV Mart</h1>
        <p className="text-xs text-gray-600">Solar Solutions</p>
      </div>
    </Link>
  );
};

export default Logo;
