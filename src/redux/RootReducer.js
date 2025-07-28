import { combineReducers } from "@reduxjs/toolkit";
import testimonial from "../pages/testimonials/TestimonialReducer";
import blog from "../pages/blog/BlogReducer";
import customerReducer from '../pages/customer/CustomerReducer'
import productReducer from '../pages/product/ProductReducer'
import adminReducer from '../pages/adminUser/AdminReducer'
import loginReducer from "../pages/login/LoginReducer";
import vendorReducer from "../pages/vendor/VendorReducer";
import orderReducer from "../pages/orders/OrderReducer";
import supportReducer from "../pages/support/SupportReducer";
import bannerReducer from "../pages/banners/BannerReducer";
import offerBannerReducer from "../pages/offersBanner/OffersBannerReducer";
import brandReducer from "../pages/brands/BrandReducer";

const rootReducer = combineReducers({
    testimonial: testimonial,
    blog: blog,
    customerReducer: customerReducer,
    productReducer: productReducer,
    adminReducer: adminReducer,
    loginReducer: loginReducer,
    vendorReducer: vendorReducer,
    orderReducer: orderReducer,
    supportReducer: supportReducer,
    bannerReducer: bannerReducer,
    offerBannerReducer: offerBannerReducer,
    brandReducer: brandReducer
})

export default rootReducer  