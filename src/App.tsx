
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SupabaseAuthProvider } from '@/contexts/SupabaseAuthContext';
import { Toaster } from '@/components/ui/sonner';

// Pages
import Index from './pages/Index';
import About from './pages/About';
import Contact from './pages/Contact';
import GridConnectivity from './pages/GridConnectivity';
import InstallationType from './pages/InstallationType';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import MobileAuth from './pages/MobileAuth';

// Customer pages
import CustomerLogin from './pages/customer/Login';
import CustomerRegister from './pages/customer/Register';
import CustomerResponseForm from './pages/customer/ResponseForm';
import CustomerMessages from './pages/customer/Messages';

// Vendor pages
import VendorLogin from './pages/vendor/Login';
import VendorRegister from './pages/vendor/Register';
import VendorMessages from './pages/vendor/Messages';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/Dashboard';
import AdminCustomers from './pages/admin/Customers';
import AdminVendors from './pages/admin/Vendors';
import AdminRequirements from './pages/admin/Requirements';
import AdminQuotations from './pages/admin/Quotations';
import AdminUsers from './pages/admin/AdminUsers';
import BannerDashboard from './pages/admin/BannerDashboard';
import BlogManager from './pages/admin/BlogManager';
import EnhancedDashboard from './pages/admin/EnhancedDashboard';
import HeroBanners from './pages/admin/HeroBanners';
import ApplianceManager from './pages/admin/ApplianceManager';
import BiharTariffManager from './pages/admin/BiharTariffManager';

// Tool pages
import BillCalculator from './pages/tools/BillCalculator';
import UnifiedBillCalculator from './pages/tools/UnifiedBillCalculator';
import EnhancedBillCalculator from './pages/tools/enhanced-bill-calculator';
import BiharBillCalculator from './pages/tools/BiharBillCalculator';
import LoadCalculation from './pages/tools/LoadCalculation';

// Blog pages
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import BlogDetails from './pages/BlogDetails';
import Blogs from './pages/Blogs';

// Game page
import EnhancedGame from './pages/EnhancedGame';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseAuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/grid-connectivity" element={<GridConnectivity />} />
            <Route path="/installation-type" element={<InstallationType />} />
            <Route path="/login" element={<Login />} />
            <Route path="/mobile-auth" element={<MobileAuth />} />

            {/* Customer routes */}
            <Route path="/customer/login" element={<CustomerLogin />} />
            <Route path="/customer/register" element={<CustomerRegister />} />
            <Route path="/customer/response-form" element={<CustomerResponseForm />} />
            <Route path="/customer/messages" element={<CustomerMessages />} />

            {/* Vendor routes */}
            <Route path="/vendor/login" element={<VendorLogin />} />
            <Route path="/vendor/register" element={<VendorRegister />} />
            <Route path="/vendor/messages" element={<VendorMessages />} />

            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/enhanced-dashboard" element={<EnhancedDashboard />} />
            <Route path="/admin/customers" element={<AdminCustomers />} />
            <Route path="/admin/vendors" element={<AdminVendors />} />
            <Route path="/admin/requirements" element={<AdminRequirements />} />
            <Route path="/admin/quotations" element={<AdminQuotations />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/banners" element={<BannerDashboard />} />
            <Route path="/admin/blogs" element={<BlogManager />} />
            <Route path="/admin/hero-banners" element={<HeroBanners />} />
            <Route path="/admin/appliances" element={<ApplianceManager />} />
            <Route path="/admin/bihar-tariff" element={<BiharTariffManager />} />

            {/* Tool routes */}
            <Route path="/bill-calculator" element={<BillCalculator />} />
            <Route path="/unified-bill-calculator" element={<UnifiedBillCalculator />} />
            <Route path="/enhanced-bill-calculator" element={<EnhancedBillCalculator />} />
            <Route path="/bihar-bill-calculator" element={<BiharBillCalculator />} />
            <Route path="/load-calculation" element={<LoadCalculation />} />

            {/* Blog routes */}
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/blog-details/:id" element={<BlogDetails />} />
            <Route path="/blogs" element={<Blogs />} />

            {/* Game route */}
            <Route path="/enhanced-game" element={<EnhancedGame />} />

            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </SupabaseAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
