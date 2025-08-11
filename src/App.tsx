import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SupabaseAuthProvider } from '@/contexts/SupabaseAuthContext';
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import GridConnectivity from "./pages/GridConnectivity";
import InstallationType from "./pages/InstallationType";
import EnhancedGame from "./pages/EnhancedGame";
import MobileAuth from "./pages/MobileAuth";

// Tools pages
import LoadCalculation from "./pages/tools/LoadCalculation";

// Customer pages
import CustomerLogin from "./pages/customer/Login";
import CustomerRegister from "./pages/customer/Register";
import CustomerDashboard from "./pages/customer/Dashboard";
import CustomerMessages from "./pages/customer/Messages";
import CustomerRequirements from "./pages/customer/Requirements";
import CustomerRequirementForm from "./pages/customer/RequirementForm";
import CustomerResponseForm from "./pages/customer/ResponseForm";
import CustomerForgotPassword from "./pages/customer/ForgotPassword";
import CustomerResetPassword from "./pages/customer/ResetPassword";

// Vendor pages
import VendorLogin from "./pages/vendor/Login";
import VendorRegister from "./pages/vendor/Register";
import VendorDashboard from "./pages/vendor/Dashboard";
import VendorMessages from "./pages/vendor/Messages";
import VendorQuotationSubmission from "./pages/vendor/QuotationSubmission";
import VendorSupabaseQuotationForm from "./pages/vendor/SupabaseQuotationForm";
import VendorForgotPassword from "./pages/vendor/ForgotPassword";
import VendorResetPassword from "./pages/vendor/ResetPassword";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import EnhancedDashboard from "./pages/admin/EnhancedDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import HeroBanners from "./pages/admin/HeroBanners";
import BlogManager from "./pages/admin/BlogManager";
import Customers from "./pages/admin/Customers";
import Vendors from "./pages/admin/Vendors";
import Quotations from "./pages/admin/Quotations";
import Requirements from "./pages/admin/Requirements";
import BannerDashboard from "./pages/admin/BannerDashboard";
import ApplianceManager from "./pages/admin/ApplianceManager";

// Blog pages
import Blogs from "./pages/Blogs";
import BlogDetail from "./pages/BlogDetail";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseAuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/mobile-auth" element={<MobileAuth />} />
              <Route path="/grid-connectivity" element={<GridConnectivity />} />
              <Route path="/installation-type" element={<InstallationType />} />
              <Route path="/enhanced-game" element={<EnhancedGame />} />
              
              {/* Tools routes */}
              <Route path="/tools/load-calculation" element={<LoadCalculation />} />
              
              {/* Blog routes */}
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />

              {/* Customer routes */}
              <Route path="/customer/login" element={<CustomerLogin />} />
              <Route path="/customer/register" element={<CustomerRegister />} />
              <Route path="/customer/dashboard" element={<CustomerDashboard />} />
              <Route path="/customer/messages" element={<CustomerMessages />} />
              <Route path="/customer/requirements" element={<CustomerRequirements />} />
              <Route path="/customer/requirement-form" element={<CustomerRequirementForm />} />
              <Route path="/customer/response-form" element={<CustomerResponseForm />} />
              <Route path="/customer/forgot-password" element={<CustomerForgotPassword />} />
              <Route path="/customer/reset-password" element={<CustomerResetPassword />} />

              {/* Vendor routes */}
              <Route path="/vendor/login" element={<VendorLogin />} />
              <Route path="/vendor/register" element={<VendorRegister />} />
              <Route path="/vendor/dashboard" element={<VendorDashboard />} />
              <Route path="/vendor/messages" element={<VendorMessages />} />
              <Route path="/vendor/quotation-submission" element={<VendorQuotationSubmission />} />
              <Route path="/vendor/supabase-quotation-form" element={<VendorSupabaseQuotationForm />} />
              <Route path="/vendor/forgot-password" element={<VendorForgotPassword />} />
              <Route path="/vendor/reset-password" element={<VendorResetPassword />} />

              {/* Admin routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<EnhancedDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/banners" element={<HeroBanners />} />
              <Route path="/admin/blogs" element={<BlogManager />} />
              <Route path="/admin/customers" element={<Customers />} />
              <Route path="/admin/vendors" element={<Vendors />} />
              <Route path="/admin/quotations" element={<Quotations />} />
              <Route path="/admin/requirements" element={<Requirements />} />
              <Route path="/admin/banner-dashboard" element={<BannerDashboard />} />
              <Route path="/admin/appliances" element={<ApplianceManager />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SupabaseAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
