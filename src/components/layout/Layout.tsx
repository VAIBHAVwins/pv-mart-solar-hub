// ENHANCED/ADDED BY CURSOR AI: Layout Component placeholder
import Header from '../common/Header';
import Footer from '../common/Footer';

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

export default Layout;
