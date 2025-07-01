import { combineReducers } from "@reduxjs/toolkit";
import  testimonial  from "../pages/testimonials/TestimonialReducer";
import  blog  from "../pages/blog/BlogReducer";
import customerReducer from '../pages/customer/CustomerReducer'
import productReducer from '../pages/product/ProductReducer'
import adminReducer from '../pages/adminUser/AdminReducer'
import  loginReducer  from "../pages/login/LoginReducer";

 const rootReducer = combineReducers({
    testimonial: testimonial,
    blog: blog,
    customerReducer: customerReducer,
    productReducer: productReducer,
    adminReducer: adminReducer,
    loginReducer: loginReducer
})

export default rootReducer  