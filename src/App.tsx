import React, { useEffect, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import "./App.css";
import { useAuth } from "./contexts/AuthContext";
import PublicRoutes from "./routes/PublicRoutes";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import AdminLogin from "./pages/admin/AdminLogin";
import UnifiedAdminDashboard from "./pages/admin/UnifiedDashboard";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminVendors from "./pages/admin/AdminVendors";
import AdminRequirements from "./pages/admin/AdminRequirements";
import AdminQuotations from "./pages/admin/AdminQuotations";
import AdminUsers from "./pages/admin/AdminUsers";
import BlogManager from "./pages/admin/BlogManager";
import HeroBanners from "./pages/admin/HeroBanners";
import BannerDashboard from "./pages/admin/BannerDashboard";
import ApplianceManager from "./pages/admin/ApplianceManager";
import BiharTariffManager from "./pages/admin/BiharTariffManager";
import AdminLayout from "@/components/admin/AdminLayout";
import CESCTariffManager from "@/pages/admin/CESCTariffManager";
import { supabase } from "./integrations/supabase/client";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicRoutes />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/admin/unified-dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <Navigate to="/admin/unified-dashboard" replace />,
      },
      {
        path: "enhanced-dashboard",
        element: <Navigate to="/admin/unified-dashboard" replace />,
      },
      {
        path: "unified-dashboard",
        element: <UnifiedAdminDashboard />,
      },
      {
        path: "customers",
        element: <AdminCustomers />,
      },
      {
        path: "vendors",
        element: <AdminVendors />,
      },
      {
        path: "requirements",
        element: <AdminRequirements />,
      },
      {
        path: "quotations",
        element: <AdminQuotations />,
      },
      {
        path: "users",
        element: <AdminUsers />,
      },
      {
        path: "blog-manager",
        element: <BlogManager />,
      },
      {
        path: "hero-banners",
        element: <HeroBanners />,
      },
      {
        path: "banner-dashboard",
        element: <BannerDashboard />,
      },
      {
        path: "appliance-manager",
        element: <ApplianceManager />,
      },
      {
        path: "bihar-tariff-manager",
        element: <BiharTariffManager />,
      },
      {
        path: "cesc-tariff-manager",
        element: <CESCTariffManager />,
      },
    ],
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
]);

function App() {
  const { authState, setAuthState } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAuthState = localStorage.getItem("authState");
    if (storedAuthState) {
      setAuthState(JSON.parse(storedAuthState));
    }
    setLoading(false);
  }, [setAuthState]);

  useEffect(() => {
    if (authState) {
      localStorage.setItem("authState", JSON.stringify(authState));
    } else {
      localStorage.removeItem("authState");
    }
  }, [authState]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
