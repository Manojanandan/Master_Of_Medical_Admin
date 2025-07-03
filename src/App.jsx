import React from 'react'
import Layout from './pages/layout/Layout'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './pages/dashboard/Dashboard'
import Product from './pages/product/Product'
import ProductEntry from './pages/product/ProductEntry'
import Blog from './pages/blog/Blog'
import BlogEntry from './pages/blog/BlogEntry'
import Testimonials from './pages/testimonials/Testimonials'
import TestimonialsEntry from './pages/testimonials/TestimonialsEntry'
import CustomerList from './pages/customer/CustomerList'
import AdminUserList from './pages/adminUser/AdminUserList'
import AdminEntry from './pages/adminUser/AdminEntry'
import Login from './pages/login/Login'
import VendorList from './pages/vendor/VendorList'

function App() {
  return (
    <React.Fragment>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route exact path="" element={<Layout />}>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/productmanagement' element={<Product />} />
          <Route path='/productmanagemententry' element={<ProductEntry />} />
          <Route path='/blog' element={<Blog />} />
          <Route path='/blogentry' element={<BlogEntry />} />
          <Route path='/testimonials' element={<Testimonials />} />
          <Route path='/testimonialsentry' element={<TestimonialsEntry />} />
          <Route path='/customer' element={<CustomerList />} />
          <Route path='/adminUser' element={<AdminUserList />} />
          <Route path='/adminuserentry' element={<AdminEntry />} />
          <Route path='/vendor' element={<VendorList />} />
        </Route>
      </Routes>
    </React.Fragment>
  )
}

export default App
