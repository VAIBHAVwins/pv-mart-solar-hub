
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  const isCustomerRoute = location.pathname.includes('/customer');
  const isVendorRoute = location.pathname.includes('/vendor');
  
  // Determine theme based on route
  const getThemeClasses = () => {
    if (isCustomerRoute) {
      return 'bg-licorice text-jonquil'; // Customer theme
    } else if (isVendorRoute) {
      return 'bg-vendor_gray-100 text-seasalt'; // Vendor theme
    }
    return 'bg-charcoal text-cornflower_blue-900'; // Default theme
  };

  const getLinkClasses = () => {
    if (isCustomerRoute) {
      return 'text-jonquil-600 hover:text-jonquil';
    } else if (isVendorRoute) {
      return 'text-chamoisee hover:text-seasalt';
    }
    return 'text-slate_gray hover:text-white';
  };

  return (
    <footer className={`${getThemeClasses()} py-8 mt-auto`}>
      <div className="container mx-auto px-4 text-center">
        <div className="flex flex-col md:flex-row gap-6 justify-center items-start text-center">
          {/* Company Info */}
          <div className="flex-1 min-w-[180px]">
            <h3 className="text-xl font-bold mb-3">
              <Link to="/admin" className="hover:underline focus:underline" tabIndex={0} aria-label="Admin Dashboard via PV MART">PV MART</Link>
            </h3>
            <p className="text-sm opacity-80">
              Your trusted platform for solar energy solutions. Connecting customers with verified solar vendors.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex-1 min-w-[180px]">
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className={`${getLinkClasses()} transition-colors`}>Home</Link></li>
              <li><Link to="/about" className={`${getLinkClasses()} transition-colors`}>About Us</Link></li>
              <li><Link to="/blogs" className={`${getLinkClasses()} transition-colors`}>Blogs</Link></li>
              <li><Link to="/contact" className={`${getLinkClasses()} transition-colors`}>Contact</Link></li>
            </ul>
          </div>

          {/* For Customers */}
          <div className="flex-1 min-w-[180px]">
            <h4 className="font-semibold mb-3">For Customers</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/customer/register" className={`${getLinkClasses()} transition-colors`}>Create Account</Link></li>
              <li><Link to="/customer/login" className={`${getLinkClasses()} transition-colors`}>Login</Link></li>
              <li><Link to="/installation-type" className={`${getLinkClasses()} transition-colors`}>Get Quote</Link></li>
            </ul>
          </div>

          {/* For Vendors */}
          <div className="flex-1 min-w-[180px]">
            <h4 className="font-semibold mb-3">For Vendors</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/vendor/register" className={`${getLinkClasses()} transition-colors`}>Join as Vendor</Link></li>
              <li><Link to="/vendor/login" className={`${getLinkClasses()} transition-colors`}>Vendor Login</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-opacity-20 mt-6 pt-6 text-center text-sm opacity-80">
          <p>&copy; 2024 <span className="font-bold">PV MART</span>. All rights reserved.</p>
          <p className="mt-2">
            <span className="font-semibold">Contact:</span> 8986985927 | info@pvmart.com | 
            xyz building, solpur, kolkata, west bengal - 700112
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
