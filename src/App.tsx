import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "@/pages/Index";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";

// Customer pages
import CustomerLogin from "@/pages/customer/Login";
import CustomerRegister from "@/pages/customer/Register";
import CustomerResponseForm from "@/pages/customer/ResponseForm";
import CustomerMessages from "@/pages/customer/Messages";
import RequirementForm from "@/pages/customer/RequirementForm";

// Vendor pages
import VendorLogin from "@/pages/vendor/Login";
import VendorRegister from "@/pages/vendor/Register";
import VendorMessages from "@/pages/vendor/Messages";
import QuotationForm from "@/pages/vendor/QuotationForm";

// Admin pages
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminEnhancedDashboard from "@/pages/admin/EnhancedDashboard";
import AdminCustomers from "@/pages/admin/Customers";
import AdminVendors from "@/pages/admin/Vendors";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminBlogManager from "@/pages/admin/BlogManager";
import AdminHeroBanners from "@/pages/admin/HeroBanners";
import AdminBannerDashboard from "@/pages/admin/BannerDashboard";
import AdminApplianceManager from "@/pages/admin/ApplianceManager";
import AdminBiharTariffManager from "@/pages/admin/BiharTariffManager";
import AdminRequirements from "@/pages/admin/Requirements";
import AdminQuotations from "@/pages/admin/Quotations";

// Tool pages
import BillCalculator from "@/pages/tools/BillCalculator";
import BiharBillCalculator from "@/pages/tools/BiharBillCalculator";
import LoadCalculation from "@/pages/tools/LoadCalculation";
import UnifiedBillCalculator from "@/pages/tools/UnifiedBillCalculator";
import EnhancedBillCalculator from "@/pages/tools/enhanced-bill-calculator";

// Blog pages
import Blog from "@/pages/Blog";
import BlogDetails from "@/pages/BlogDetails";
import Blogs from "@/pages/Blogs";
import BlogDetail from "@/pages/BlogDetail";

// Other pages
import GridConnectivity from "@/pages/GridConnectivity";
import InstallationType from "@/pages/InstallationType";
import EnhancedGame from "@/pages/EnhancedGame";
import MobileAuth from "@/pages/MobileAuth";

import { SupabaseAuthProvider } from "@/contexts/SupabaseAuthContext";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/mobile-auth",
    element: <MobileAuth />,
  },
  {
    path: "/customer/login",
    element: <CustomerLogin />,
  },
  {
    path: "/customer/register",
    element: <CustomerRegister />,
  },
  {
    path: "/customer/response-form",
    element: <CustomerResponseForm />,
  },
  {
    path: "/customer/messages",
    element: <CustomerMessages />,
  },
  {
    path: "/customer/requirement-form",
    element: <RequirementForm />,
  },
  {
    path: "/vendor/login",
    element: <VendorLogin />,
  },
  {
    path: "/vendor/register",
    element: <VendorRegister />,
  },
  {
    path: "/vendor/messages",
    element: <VendorMessages />,
  },
  {
    path: "/vendor/quotation-form",
    element: <QuotationForm />,
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/admin/enhanced-dashboard",
    element: <AdminEnhancedDashboard />,
  },
  {
    path: "/admin/customers",
    element: <AdminCustomers />,
  },
  {
    path: "/admin/vendors",
    element: <AdminVendors />,
  },
  {
    path: "/admin/users",
    element: <AdminUsers />,
  },
  {
    path: "/admin/blog-manager",
    element: <AdminBlogManager />,
  },
  {
    path: "/admin/hero-banners",
    element: <AdminHeroBanners />,
  },
  {
    path: "/admin/banner-dashboard",
    element: <AdminBannerDashboard />,
  },
  {
    path: "/admin/appliance-manager",
    element: <AdminApplianceManager />,
  },
  {
    path: "/admin/bihar-tariff-manager",
    element: <AdminBiharTariffManager />,
  },
  {
    path: "/admin/requirements",
    element: <AdminRequirements />,
  },
  {
    path: "/admin/quotations",
    element: <AdminQuotations />,
  },
  {
    path: "/tools/bill-calculator",
    element: <BillCalculator />,
  },
  {
    path: "/tools/bihar-bill-calculator",
    element: <BiharBillCalculator />,
  },
  {
    path: "/tools/load-calculation",
    element: <LoadCalculation />,
  },
  {
    path: "/tools/unified-bill-calculator",
    element: <UnifiedBillCalculator />,
  },
  {
    path: "/tools/enhanced-bill-calculator",
    element: <EnhancedBillCalculator />,
  },
  {
    path: "/blog",
    element: <Blog />,
  },
  {
    path: "/blogs",
    element: <Blogs />,
  },
  {
    path: "/blog/:slug",
    element: <BlogDetails />,
  },
  {
    path: "/blogs/:slug",
    element: <BlogDetail />,
  },
  {
    path: "/grid-connectivity",
    element: <GridConnectivity />,
  },
  {
    path: "/installation-type",
    element: <InstallationType />,
  },
  {
    path: "/game",
    element: <EnhancedGame />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseAuthProvider>
        <TooltipProvider>
          <Toaster />
          <RouterProvider router={router} />
        </TooltipProvider>
      </SupabaseAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
