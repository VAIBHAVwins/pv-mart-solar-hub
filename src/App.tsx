
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SupabaseAuthProvider } from '@/contexts/SupabaseAuthContext';
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blogs from "./pages/Blogs";
import BlogDetail from "./pages/BlogDetail";
import Game from "./pages/Game";
import InstallationType from "./pages/InstallationType";
import GridConnectivity from "./pages/GridConnectivity";
import CustomerLogin from "./pages/customer/Login";
import CustomerRegister from "./pages/customer/Register";
import CustomerDashboard from "./pages/customer/Dashboard";
import CustomerRequirements from "./pages/customer/Requirements";
import CustomerResetPassword from "./pages/customer/ResetPassword";
import CustomerForgotPassword from "./pages/customer/ForgotPassword";
import VendorLogin from "./pages/vendor/Login";
import VendorRegister from "./pages/vendor/Register";
import VendorDashboard from "./pages/vendor/Dashboard";
import VendorQuotationSubmission from "./pages/vendor/QuotationSubmission";
import VendorSupabaseQuotationForm from "./pages/vendor/SupabaseQuotationForm";
import VendorResetPassword from "./pages/vendor/ResetPassword";
import VendorForgotPassword from "./pages/vendor/ForgotPassword";
import AdminDashboard from "./pages/admin/Dashboard";
import BannerDashboard from "./pages/admin/BannerDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
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
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="/game" element={<Game />} />
              <Route path="/installation-type" element={<InstallationType />} />
              <Route path="/grid-connectivity" element={<GridConnectivity />} />
              
              {/* Customer Routes */}
              <Route path="/customer/login" element={<CustomerLogin />} />
              <Route path="/customer/register" element={<CustomerRegister />} />
              <Route path="/customer/dashboard" element={<CustomerDashboard />} />
              <Route path="/customer/requirements" element={<CustomerRequirements />} />
              <Route path="/customer/reset-password" element={<CustomerResetPassword />} />
              <Route path="/customer/forgot-password" element={<CustomerForgotPassword />} />
              
              {/* Vendor Routes */}
              <Route path="/vendor/login" element={<VendorLogin />} />
              <Route path="/vendor/register" element={<VendorRegister />} />
              <Route path="/vendor/dashboard" element={<VendorDashboard />} />
              <Route path="/vendor/quotation" element={<VendorQuotationSubmission />} />
              <Route path="/vendor/supabase-quotation" element={<VendorSupabaseQuotationForm />} />
              <Route path="/vendor/reset-password" element={<VendorResetPassword />} />
              <Route path="/vendor/forgot-password" element={<VendorForgotPassword />} />
              
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/banners" element={<BannerDashboard />} />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SupabaseAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
