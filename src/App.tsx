
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blogs from "./pages/Blogs";
import BlogDetail from "./pages/BlogDetail";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Admin routes
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import EnhancedDashboard from "./pages/admin/EnhancedDashboard";
import BlogManager from "./pages/admin/BlogManager";
import HeroBanners from "./pages/admin/HeroBanners";
import BannerDashboard from "./pages/admin/BannerDashboard";
import ApplianceManager from "./pages/admin/ApplianceManager";
import BiharTariffManager from "./pages/admin/BiharTariffManager";

// Customer routes
import CustomerLogin from "./pages/customer/Login";
import CustomerRegister from "./pages/customer/Register";
import CustomerDashboard from "./pages/customer/Dashboard";
import CustomerRequirements from "./pages/customer/Requirements";
import RequirementForm from "./pages/customer/RequirementForm";
import CustomerMessages from "./pages/customer/Messages";
import ResponseForm from "./pages/customer/ResponseForm";
import CustomerForgotPassword from "./pages/customer/ForgotPassword";
import CustomerResetPassword from "./pages/customer/ResetPassword";

// Vendor routes
import VendorLogin from "./pages/vendor/Login";
import VendorRegister from "./pages/vendor/Register";
import VendorDashboard from "./pages/vendor/Dashboard";
import QuotationSubmission from "./pages/vendor/QuotationSubmission";
import SupabaseQuotationForm from "./pages/vendor/SupabaseQuotationForm";
import VendorMessages from "./pages/vendor/Messages";
import VendorForgotPassword from "./pages/vendor/ForgotPassword";
import VendorResetPassword from "./pages/vendor/ResetPassword";

// Tool routes
import BillCalculator from "./pages/tools/BillCalculator";
import BiharBillCalculator from "./pages/tools/BiharBillCalculator";
import EnhancedBillCalculatorPage from "./pages/tools/enhanced-bill-calculator";
import LoadCalculation from "./pages/tools/LoadCalculation";

import MobileAuth from "./pages/MobileAuth";
import EnhancedGame from "./pages/EnhancedGame";
import GridConnectivity from "./pages/GridConnectivity";
import InstallationType from "./pages/InstallationType";

import { SupabaseAuthProvider } from "./contexts/SupabaseAuthContext";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SupabaseAuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/mobile-auth" element={<MobileAuth />} />
              <Route path="/enhanced-game" element={<EnhancedGame />} />
              <Route path="/grid-connectivity" element={<GridConnectivity />} />
              <Route path="/installation-type" element={<InstallationType />} />

              {/* Tool routes */}
              <Route path="/tools/bill-calculator" element={<BillCalculator />} />
              <Route path="/tools/bihar-bill-calculator" element={<BiharBillCalculator />} />
              <Route path="/tools/enhanced-bill-calculator" element={<EnhancedBillCalculatorPage />} />
              <Route path="/tools/load-calculation" element={<LoadCalculation />} />

              {/* Admin routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/enhanced-dashboard" element={<EnhancedDashboard />} />
              <Route path="/admin/blog-manager" element={<BlogManager />} />
              <Route path="/admin/hero-banners" element={<HeroBanners />} />
              <Route path="/admin/banner-dashboard" element={<BannerDashboard />} />
              <Route path="/admin/appliance-manager" element={<ApplianceManager />} />
              <Route path="/admin/bihar-tariff-manager" element={<BiharTariffManager />} />

              {/* Customer routes */}
              <Route path="/customer/login" element={<CustomerLogin />} />
              <Route path="/customer/register" element={<CustomerRegister />} />
              <Route path="/customer/dashboard" element={<CustomerDashboard />} />
              <Route path="/customer/requirements" element={<CustomerRequirements />} />
              <Route path="/customer/requirement-form" element={<RequirementForm />} />
              <Route path="/customer/messages" element={<CustomerMessages />} />
              <Route path="/customer/response-form" element={<ResponseForm />} />
              <Route path="/customer/forgot-password" element={<CustomerForgotPassword />} />
              <Route path="/customer/reset-password" element={<CustomerResetPassword />} />

              {/* Vendor routes */}
              <Route path="/vendor/login" element={<VendorLogin />} />
              <Route path="/vendor/register" element={<VendorRegister />} />
              <Route path="/vendor/dashboard" element={<VendorDashboard />} />
              <Route path="/vendor/quotation-submission" element={<QuotationSubmission />} />
              <Route path="/vendor/supabase-quotation-form" element={<SupabaseQuotationForm />} />
              <Route path="/vendor/messages" element={<VendorMessages />} />
              <Route path="/vendor/forgot-password" element={<VendorForgotPassword />} />
              <Route path="/vendor/reset-password" element={<VendorResetPassword />} />

              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </SupabaseAuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
