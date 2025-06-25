// ENHANCED/ADDED BY CURSOR AI: Layout Component placeholder
import Header from '../common/Header';
import Footer from '../common/Footer';
import { Helmet } from 'react-helmet';

const Layout = ({ children }: { children: React.ReactNode }) => (
  <>
    {/* CURSOR AI: SEO meta tags and Google Analytics placeholder */}
    <Helmet>
      <title>PVMart - Solar Platform</title>
      <meta name="description" content="PVMart connects you with trusted solar vendors for affordable, high-quality solar installations in India." />
      <meta name="keywords" content="solar, solar energy, solar installation, India, PVMart, renewable energy" />
      {/* Google Analytics placeholder */}
      {/* <script async src="https://www.googletagmanager.com/gtag/js?id=UA-XXXXXXX-X"></script>
      <script>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'UA-XXXXXXX-X');
        `}
      </script> */}
    </Helmet>
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  </>
);

export default Layout;
