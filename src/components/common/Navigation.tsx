
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

interface NavigationProps {
  getLinkClasses: () => string;
}

const Navigation = ({ getLinkClasses }: NavigationProps) => {
  return (
    <nav className="hidden lg:flex items-center space-x-8">
      <Link to="/" className={getLinkClasses()}>
        Home
      </Link>
      <Link to="/about" className={getLinkClasses()}>
        About
      </Link>
      <Link to="/blogs" className={getLinkClasses()}>
        Blogs
      </Link>
      <Link to="/contact" className={getLinkClasses()}>
        Contact
      </Link>
      <Link to="/game" className={getLinkClasses()}>
        Game
      </Link>
      <Link to="/admin/login" className={`${getLinkClasses()} flex items-center gap-1`}>
        <Shield className="w-4 h-4" />
        Admin
      </Link>
    </nav>
  );
};

export default Navigation;
