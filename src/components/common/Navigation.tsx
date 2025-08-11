
import { Link, useLocation } from 'react-router-dom';
import NavigationMenuDemo from './NavigationMenuDemo';

const Navigation = ({ getLinkClasses }: { getLinkClasses: () => string }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/blogs', label: 'Blog' },
    { path: '/contact', label: 'Contact' }
  ];

  return (
    <nav className="hidden lg:flex items-center space-x-2">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`${getLinkClasses()} ${
            location.pathname === item.path ? 'bg-blue-600/20 text-blue-600' : ''
          }`}
        >
          {item.label}
        </Link>
      ))}
      <NavigationMenuDemo />
    </nav>
  );
};

export default Navigation;
