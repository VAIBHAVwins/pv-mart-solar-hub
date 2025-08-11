
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SupabaseAuthProvider } from "@/contexts/SupabaseAuthContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import BlogDetails from "./pages/BlogDetails";
import Blogs from "./pages/Blogs";
import NotFound from "./pages/NotFound";
import EnhancedGame from "./pages/EnhancedGame";
import GridConnectivity from "./pages/GridConnectivity";
import InstallationType from "./pages/InstallationType";

// Customer pages
import CustomerLogin from "./pages/customer/Login";
import CustomerRegister from "./pages/customer/Register";
import CustomerDashboard from "./pages/customer/Dashboard";
import CustomerRequirements from "./pages/customer/Requirements";
import CustomerRequirementForm from "./pages/customer/RequirementForm";
import CustomerMessages from "./pages/customer/Messages";
import CustomerForgotPassword from "./pages/customer/ForgotPassword";
import CustomerResetPassword from "./pages/customer/ResetPassword";
import CustomerResponseForm from "./pages/customer/ResponseForm";

// Vendor pages
import VendorLogin from "./pages/vendor/Login";
import VendorRegister from "./pages/vendor/Register";
import VendorDashboard from "./pages/vendor/Dashboard";
import VendorQuotationSubmission from "./pages/vendor/QuotationSubmission";
import VendorSupabaseQuotationForm from "./pages/vendor/SupabaseQuotationForm";
import VendorMessages from "./pages/vendor/Messages";
import VendorForgotPassword from "./pages/vendor/ForgotPassword";
import VendorResetPassword from "./pages/vendor/ResetPassword";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminEnhancedDashboard from "./pages/admin/EnhancedDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCustomers from "./pages/admin/Customers";
import AdminVendors from "./pages/admin/Vendors";
import AdminRequirements from "./pages/admin/Requirements";
import AdminQuotations from "./pages/admin/Quotations";
import AdminBlogManager from "./pages/admin/BlogManager";
import AdminHeroBanners from "./pages/admin/HeroBanners";
import AdminBannerDashboard from "./pages/admin/BannerDashboard";
import AdminApplianceManager from "./pages/admin/ApplianceManager";

// Tools pages
import LoadCalculation from "./pages/tools/LoadCalculation";
import BillCalculator from "./pages/tools/BillCalculator";
import EnhancedBillCalculatorPage from "./pages/tools/enhanced-bill-calculator";

// Auth pages
import MobileAuth from "./pages/MobileAuth";
import Login from "./pages/Login";

const queryClient = new QueryClient();

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
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/blog-detail" element={<BlogDetails />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/game" element={<EnhancedGame />} />
              <Route path="/grid-connectivity" element={<GridConnectivity />} />
              <Route path="/installation-type" element={<InstallationType />} />

              {/* Customer routes */}
              <Route path="/customer/login" element={<CustomerLogin />} />
              <Route path="/customer/register" element={<CustomerRegister />} />
              <Route path="/customer/dashboard" element={<CustomerDashboard />} />
              <Route path="/customer/requirements" element={<CustomerRequirements />} />
              <Route path="/customer/requirement-form" element={<CustomerRequirementForm />} />
              <Route path="/customer/messages" element={<CustomerMessages />} />
              <Route path="/customer/forgot-password" element={<CustomerForgotPassword />} />
              <Route path="/customer/reset-password" element={<CustomerResetPassword />} />
              <Route path="/customer/response-form" element={<CustomerResponseForm />} />

              {/* Vendor routes */}
              <Route path="/vendor/login" element={<VendorLogin />} />
              <Route path="/vendor/register" element={<VendorRegister />} />
              <Route path="/vendor/dashboard" element={<VendorDashboard />} />
              <Route path="/vendor/quotation-submission" element={<VendorQuotationSubmission />} />
              <Route path="/vendor/supabase-quotation-form" element={<VendorSupabaseQuotationForm />} />
              <Route path="/vendor/messages" element={<VendorMessages />} />
              <Route path="/vendor/forgot-password" element={<VendorForgotPassword />} />
              <Route path="/vendor/reset-password" element={<VendorResetPassword />} />

              {/* Admin routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/enhanced-dashboard" element={<AdminEnhancedDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/customers" element={<AdminCustomers />} />
              <Route path="/admin/vendors" element={<AdminVendors />} />
              <Route path="/admin/requirements" element={<AdminRequirements />} />
              <Route path="/admin/quotations" element={<AdminQuotations />} />
              <Route path="/admin/blog-manager" element={<AdminBlogManager />} />
              <Route path="/admin/hero-banners" element={<AdminHeroBanners />} />
              <Route path="/admin/banner-dashboard" element={<AdminBannerDashboard />} />
              <Route path="/admin/appliance-manager" element={<AdminApplianceManager />} />

              {/* Tools routes */}
              <Route path="/tools/load-calculation" element={<LoadCalculation />} />
              <Route path="/tools/bill-calculator" element={<BillCalculator />} />
              <Route path="/tools/enhanced-bill-calculator" element={<EnhancedBillCalculatorPage />} />

              {/* Auth routes */}
              <Route path="/mobile-auth" element={<MobileAuth />} />
              <Route path="/login" element={<Login />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SupabaseAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
