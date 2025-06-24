
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout = ({ children, className = '' }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className={`flex-1 ${className}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
