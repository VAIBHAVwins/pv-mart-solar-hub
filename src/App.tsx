
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Index';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import CustomerRegister from './pages/customer/Register';
import VendorRegister from './pages/vendor/Register';
import CustomerLogin from './pages/customer/Login';
import VendorLogin from './pages/vendor/Login';
import Login from './pages/Login';
import CustomerDashboard from './pages/customer/Dashboard';
import VendorDashboard from './pages/vendor/Dashboard';
import CustomerRequirements from './pages/customer/Requirements';
import RequirementForm from './pages/customer/RequirementForm';
import AdminLogin from './pages/admin/Login';
import AdminPanel from './pages/admin/Dashboard';
import NotFound from './pages/NotFound';
import Game from './pages/Game';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/customer/register" element={<CustomerRegister />} />
          <Route path="/vendor/register" element={<VendorRegister />} />
          <Route path="/customer/login" element={<CustomerLogin />} />
          <Route path="/vendor/login" element={<VendorLogin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          <Route path="/vendor/dashboard" element={<VendorDashboard />} />
          <Route path="/customer/requirements" element={<CustomerRequirements />} />
          <Route path="/customer/quote-request" element={<RequirementForm />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/game" element={<Game />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
