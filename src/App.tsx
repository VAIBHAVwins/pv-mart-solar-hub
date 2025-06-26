import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Index';
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
import VendorQuotationSubmission from './pages/vendor/QuotationSubmission';
import VendorQuotationList from './pages/vendor/QuotationList';
import AdminLogin from './pages/admin/Login';
import AdminPanel from './pages/admin/Dashboard';
import NotFound from './pages/NotFound';
import Game from './pages/Game';
import InstallationType from './pages/InstallationType';
import GridConnectivity from './pages/GridConnectivity';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import AdminGitHubCallback from './pages/admin/GitHubCallback';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/installation-type" element={<InstallationType />} />
          <Route path="/grid-connectivity" element={<GridConnectivity />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/customer/register" element={<CustomerRegister />} />
          <Route path="/vendor/register" element={<VendorRegister />} />
          <Route path="/customer/login" element={<CustomerLogin />} />
          <Route path="/vendor/login" element={<VendorLogin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          <Route path="/vendor/dashboard" element={<VendorDashboard />} />
          <Route path="/customer/requirements" element={<CustomerRequirements />} />
          <Route path="/customer/quote-request" element={<RequirementForm />} />
          <Route path="/vendor/quotation-submission" element={<VendorQuotationSubmission />} />
          <Route path="/vendor/quotation-list" element={<VendorQuotationList />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/github-callback" element={<AdminGitHubCallback />} />
          <Route path="/game" element={<Game />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
