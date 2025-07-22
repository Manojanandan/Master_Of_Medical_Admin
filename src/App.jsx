import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Layout from './pages/layout/Layout';
import Dashboard from './pages/dashboard/Dashboard';
import Product from './pages/product/Product';
import ProductEntry from './pages/product/ProductEntry';
import Blog from './pages/blog/Blog';
import BlogEntry from './pages/blog/BlogEntry';
import Testimonials from './pages/testimonials/Testimonials';
import TestimonialsEntry from './pages/testimonials/TestimonialsEntry';
import CustomerList from './pages/customer/CustomerList';
import AdminUserList from './pages/adminUser/AdminUserList';
import AdminEntry from './pages/adminUser/AdminEntry';
import Login from './pages/login/Login';
import VendorList from './pages/vendor/VendorList';
import ProtectedRoutes from './pages/routes/ProtectedRoutes';
import LoginRoutes from './pages/routes/LoginRoutes';
import AdminView from './pages/adminUser/AdminView';
import CustomerView from './pages/customer/CustomerView';
import VendorView from './pages/vendor/VendorView';
import TestimonialView from './pages/testimonials/TestimonialView';
import BlogView from './pages/blog/BlogView';
import Order from './pages/orders/Order'
import SupportList from './pages/support/SupportList';
import SupportView from './pages/support/SupportView';
import OrderView from './pages/orders/OrderView';


function App() {
  return (
    <Routes>
      {/* Public Routes (Login Only) */}
      <Route element={<LoginRoutes />}>
        <Route path="/" element={<Login />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoutes />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/productmanagement" element={<Product />} />
          <Route path="/productmanagemententry" element={<ProductEntry />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blogentry" element={<BlogEntry />} />
          <Route path='/blogview' element={<BlogView />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/testimonialsentry" element={<TestimonialsEntry />} />
          <Route path="/testimonialview" element={<TestimonialView />} />
          <Route path="/customer" element={<CustomerList />} />
          <Route path="/customerview" element={<CustomerView />} />
          <Route path="/adminUser" element={<AdminUserList />} />
          <Route path="/adminuserentry" element={<AdminEntry />} />
          <Route path="/viewAdmin" element={<AdminView />} />
          <Route path="/vendor" element={<VendorList />} />
          <Route path="/vendorview" element={<VendorView />} />
          <Route path='/orders' element={<Order />}  />
          <Route path='/orderview' element={<OrderView />}  />
          <Route path='/support' element={<SupportList />}  />
          <Route path='/supportview' element={<SupportView />}  />
        </Route>
      </Route>

      {/* Catch-all for unknown paths */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
