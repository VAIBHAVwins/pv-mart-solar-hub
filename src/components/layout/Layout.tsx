
import Header from '../common/Header';
import Footer from '../common/Footer';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout = ({ children, className }: LayoutProps) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      <Helmet>
        <title>PVMart - Solar Platform</title>
        <meta name="description" content="PVMart connects you with trusted solar vendors for affordable, high-quality solar installations in India." />
        <meta name="keywords" content="solar, solar energy, solar installation, India, PVMart, renewable energy" />
      </Helmet>
      <div className={`min-h-screen flex flex-col ${className || ''}`}>
        <Header />
        <main className="flex-1">{children}</main>
        {!isAdminRoute && <Footer />}
      </div>
    </>
  );
};

export default Layout;
