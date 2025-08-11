
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Login from '@/pages/Login';
import Blog from '@/pages/Blog';
import BlogDetail from '@/pages/BlogDetail';
import BillCalculator from '@/pages/tools/BillCalculator';
import BiharBillCalculator from '@/pages/tools/BiharBillCalculator';
import UnifiedBillCalculator from '@/pages/tools/UnifiedBillCalculator';
import LoadCalculation from '@/pages/tools/LoadCalculation';
import NotFound from '@/pages/NotFound';

const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:id" element={<BlogDetail />} />
      <Route path="/tools/bill-calculator" element={<BillCalculator />} />
      <Route path="/tools/bihar-bill-calculator" element={<BiharBillCalculator />} />
      <Route path="/tools/unified-bill-calculator" element={<UnifiedBillCalculator />} />
      <Route path="/tools/load-calculation" element={<LoadCalculation />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default PublicRoutes;
