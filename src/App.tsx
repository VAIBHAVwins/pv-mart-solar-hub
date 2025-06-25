import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import CustomerRegister from './pages/customer/Register';
import VendorRegister from './pages/vendor/Register';
import Login from './pages/Login';
import CustomerDashboard from './pages/customer/Dashboard';
import VendorDashboard from './pages/vendor/Dashboard';
import AdminPanel from './pages/admin/Dashboard';
import NotFound from './pages/NotFound';

// ENHANCED BY CURSOR AI: Main routing and page structure
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/customer/register" element={<CustomerRegister />} />
        <Route path="/vendor/register" element={<VendorRegister />} />
        <Route path="/login" element={<Login />} />
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/vendor/dashboard" element={<VendorDashboard />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
