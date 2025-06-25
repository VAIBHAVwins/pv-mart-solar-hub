import { Link, useLocation } from 'react-router-dom';
import { useTheme } from 'next-themes';

// ENHANCED/ADDED BY CURSOR AI: Footer Component placeholder
const Footer = () => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const isCustomerRoute = location.pathname.includes('/customer');
  const isVendorRoute = location.pathname.includes('/vendor');
  
  // Determine theme based on route
  const getThemeClasses = () => {
    if (isCustomerRoute) {
      return 'bg-[#3d1604] text-[#f8b200]'; // Customer theme
    } else if (isVendorRoute) {
      return 'bg-[#171a21] text-[#f7f7f6]'; // Vendor theme
    }
    return 'bg-[#444e59] text-[#deebfc]'; // Default theme
  };

  const getLinkClasses = () => {
    if (isCustomerRoute) {
      return 'text-[#fecb00] hover:text-[#f8b200]';
    } else if (isVendorRoute) {
      return 'text-[#d2cec8] hover:text-[#f7f7f6]';
    }
    return 'text-[#c5c1ba] hover:text-white';
  };

  return (
    <footer className={`${getThemeClasses()} py-8 mt-auto`}>
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-6">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-3">PHOTOVOLATICSYNTHESIS</h3>
            <p className="text-sm opacity-80">
              Your trusted platform for solar energy solutions. Connecting customers with verified solar vendors.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className={`${getLinkClasses()} transition-colors`}>Home</Link></li>
              <li><Link to="/about" className={`${getLinkClasses()} transition-colors`}>About Us</Link></li>
              <li><Link to="/blog" className={`${getLinkClasses()} transition-colors`}>Blog</Link></li>
              <li><Link to="/contact" className={`${getLinkClasses()} transition-colors`}>Contact</Link></li>
            </ul>
            <div className="mt-4 flex flex-col gap-2">
              <span className="font-semibold text-xs mb-1">Theme</span>
              <div className="flex gap-2">
                <button
                  className={`px-3 py-1 rounded ${theme === 'light' ? 'bg-white text-black font-bold' : 'bg-transparent border border-white text-white'}`}
                  onClick={() => setTheme('light')}
                  aria-label="Switch to light mode"
                >Light</button>
                <button
                  className={`px-3 py-1 rounded ${theme === 'dark' ? 'bg-black text-white font-bold' : 'bg-transparent border border-white text-white'}`}
                  onClick={() => setTheme('dark')}
                  aria-label="Switch to dark mode"
                >Dark</button>
                <button
                  className={`px-3 py-1 rounded ${theme === 'system' ? 'bg-gray-300 text-black font-bold' : 'bg-transparent border border-white text-white'}`}
                  onClick={() => setTheme('system')}
                  aria-label="Switch to system default mode"
                >System</button>
              </div>
            </div>
          </div>

          {/* For Customers */}
          <div>
            <h4 className="font-semibold mb-3">For Customers</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/customer/register" className={`${getLinkClasses()} transition-colors`}>Sign Up</Link></li>
              <li><Link to="/customer/login" className={`${getLinkClasses()} transition-colors`}>Login</Link></li>
              <li><Link to="/customer/requirements" className={`${getLinkClasses()} transition-colors`}>Submit Requirements</Link></li>
            </ul>
          </div>

          {/* For Vendors */}
          <div>
            <h4 className="font-semibold mb-3">For Vendors</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/vendor/register" className={`${getLinkClasses()} transition-colors`}>Join as Vendor</Link></li>
              <li><Link to="/vendor/login" className={`${getLinkClasses()} transition-colors`}>Vendor Login</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-opacity-20 mt-6 pt-6 text-center text-sm opacity-80">
          <p>&copy; 2024 <span className="font-bold">PHOTOVOLATICSYNTHESIS</span>. All rights reserved. | 
            <Link to="/privacy" className={`${getLinkClasses()} ml-2`}>Privacy Policy</Link> | 
            <Link to="/terms" className={`${getLinkClasses()} ml-2`}>Terms of Service</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
