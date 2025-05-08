import { combineReducers } from "@reduxjs/toolkit";
import  testimonial  from "../pages/testimonials/TestimonialReducer";
import  blog  from "../pages/blog/BlogReducer";

 const rootReducer = combineReducers({
    testimonial: testimonial,
    blog: blog
})

export default rootReducer  