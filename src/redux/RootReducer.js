import { combineReducers } from "@reduxjs/toolkit";
import  testimonial  from "../pages/testimonials/TestimonialReducer";
import  blog  from "../pages/blog/BlogReducer";
import customerReducer from '../pages/customer/CustomerReducer'
import productReducer from '../pages/product/ProductReducer'

 const rootReducer = combineReducers({
    testimonial: testimonial,
    blog: blog,
    customerReducer: customerReducer,
    productReducer: productReducer
})

export default rootReducer  