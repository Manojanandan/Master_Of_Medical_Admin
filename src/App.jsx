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

function App() {
  return (
    <React.Fragment>
      <Routes>
        <Route exact path="" element={<Layout />}>
          <Route path='/' element={<Dashboard />} />
          <Route path='/productmanagement' element={<Product />} />
          <Route path='/productmanagemententry' element={<ProductEntry />} />
          <Route path='/blog' element={<Blog />} />
          <Route path='/blogentry' element={<BlogEntry />} />
          <Route path='/testimonials' element={<Testimonials />} />
          <Route path='/testimonialsentry' element={<TestimonialsEntry />} />
        </Route>
      </Routes>
    </React.Fragment>
  )
}

export default App
