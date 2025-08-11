
import React from 'react';
import { Link } from 'react-router-dom';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: { email?: string; id?: string } | null;
  handleLogout: () => void;
}

const MobileMenu = ({ isOpen, onClose, user, handleLogout }: MobileMenuProps) => {
  if (!isOpen) return null;

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/blogs', label: 'Blog' },
    { path: '/contact', label: 'Contact' },
    { path: '/tools/bill-calculator', label: 'Tools' }
  ];

  return (
    <div className="lg:hidden border-t bg-white">
      <div className="px-4 py-3 space-y-3">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md"
            onClick={onClose}
          >
            {item.label}
          </Link>
        ))}
        
        <div className="pt-3 border-t space-y-2">
          {!user ? (
            <>
              <Link
                to="/customer/login"
                className="block px-3 py-2 text-center border border-blue-600 text-blue-600 rounded-md"
                onClick={onClose}
              >
                Customer Login
              </Link>
              <Link
                to="/vendor/login"
                className="block px-3 py-2 text-center bg-blue-600 text-white rounded-md"
                onClick={onClose}
              >
                Vendor Login
              </Link>
            </>
          ) : (
            <button
              className="w-full px-3 py-2 text-center border border-red-500 text-red-500 rounded-md"
              onClick={() => {
                handleLogout();
                onClose();
              }}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
