
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SupabaseAuthProvider } from './contexts/SupabaseAuthContext';
import Index from "./pages/Index";
import CustomerLogin from "./pages/customer/Login";
import CustomerRegister from "./pages/customer/Register";
import VendorLogin from "./pages/vendor/Login";
import VendorRegister from "./pages/vendor/Register";
import AdminLogin from "./pages/admin/Login";
import AdminPanel from "./pages/admin/Dashboard";
import AdminBanners from "./pages/admin/Banners";
import AdminBlogs from "./pages/admin/Blogs";
import AdminUsers from "./pages/admin/Users";
import AdminCustomers from "./pages/admin/Customers";
import AdminVendors from "./pages/admin/Vendors";
import AdminQuotations from "./pages/admin/Quotations";
import AdminRequirements from "./pages/admin/Requirements";
import Blog from "./pages/Blog";
import ElectricityCalculator from "./pages/ElectricityCalculator";
import SolarDesignGame from "./pages/SolarDesignGame";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SupabaseAuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/customer/login" element={<CustomerLogin />} />
            <Route path="/customer/register" element={<CustomerRegister />} />
            <Route path="/vendor/login" element={<VendorLogin />} />
            <Route path="/vendor/register" element={<VendorRegister />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminPanel />} />
            <Route path="/admin/banners" element={<AdminBanners />} />
            <Route path="/admin/blogs" element={<AdminBlogs />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/customers" element={<AdminCustomers />} />
            <Route path="/admin/vendors" element={<AdminVendors />} />
            <Route path="/admin/quotations" element={<AdminQuotations />} />
            <Route path="/admin/requirements" element={<AdminRequirements />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/electricity-calculator" element={<ElectricityCalculator />} />
            <Route path="/solar-design-game" element={<SolarDesignGame />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SupabaseAuthProvider>
  </QueryClientProvider>
);

export default App;
