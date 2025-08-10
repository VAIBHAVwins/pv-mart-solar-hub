
import { Link, useLocation } from 'react-router-dom';

const Navigation = ({ getLinkClasses }: { getLinkClasses: () => string }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/installation-type', label: 'Installation Types' },
    { path: '/grid-connectivity', label: 'Grid Connectivity' },
    { path: '/blogs', label: 'Blog' },
    { path: '/enhanced-game', label: 'Solar Game' },
    { path: '/contact', label: 'Contact' }
  ];

  return (
    <nav className="hidden lg:flex items-center space-x-8">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`${getLinkClasses()} ${
            location.pathname === item.path ? 'border-b-2 border-current' : ''
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
