import instance from "./Instance";

//login creation
export const userLogin = async (data) => {
  return await instance.post(`admin-user/login-admin`, data);
};

// Testimonial Api
export const addTestimonial = (data) => {
  return instance.post("testimonial/create-testimonial", data);
};
export const getTestimonial = (id, data) => {
  if (id !== "") {
    return instance.get(`testimonial/get-testimonial/${id}`);
  }
  if (data !== "") {
    return instance.get(`testimonial/get-all-testimonial${data}`);
  }
};
export const editTestimonial = (data) => {
  return instance.put("testimonial/update-testimonial", data);
};
export const deleteTestimonial = (id) => {
  return instance.delete(`testimonial/delete-testimonial/${id}`);
};

// Blog Api
export const getBlog = (id, data) => {
  if (id !== "") {
    return instance.get(`blog/get-blog/${id}`);
  }
  if (data !== "") {
    return instance.get(`blog/get-all-blog${data}`);
  }
};

export const addBlog = (data) => {
  return instance.post(`blog/create-blog`, data);
};
export const editBlog = (data) => {
  return instance.put(`blog/update-blog`, data);
};
export const deleteBlog = (id) => {
  return instance.delete(`blog/delete-blog/${id}`);
};

// Customer
export const getCustomer = (id, data) => {
  if (id !== "") {
    return instance.get(`customer/get-customer/${id}`);
  } else {
    return instance.get(`customer/get-all-customer${data}`);
  }
};

export const deleteCustomer = (id) => {
  return instance.delete(`customer/delete-customer/${id}`);
};

export const updateCustomer = (data) => {
  return instance.put(`customer/update-customer`, data);
};

// Product
export const createProduct = async (data) => {
  return await instance.post("product/create-product", data);
};
export const getAllProduct = async (id, data) => {
  if (id !== "") {
    return await instance.get(`product/get-product/${id}`);
  } else {
    return await instance.get(`product/get-all-product${data}`);
  }
};
export const updateProduct = async (data) => {
  return await instance.put(
    `product/update-product`,
    data
  );
};
export const deleteProduct = async (data) => {
  return await instance.delete(
    `product/delete-product/${data}`,
    data
  );
};
export const categoryList = async () =>{
  return await instance.get("product/get-all-catagory")
}
export const subCategoryList = async (id) =>{
  return await instance.get(`product/get-all-sub-catagory/${id}`)
}

//Admin User
export const getAllAdminUser = async (id, data) => {
  if (id !== "") {
    return await instance.get(`admin-user/get-admin/${id}`);
  } else {
    return await instance.get(`admin-user/get-all-admin${data}`);
  }
};
export const createAdminUser = async (data) => {
  return await instance.post(`admin-user/create-admin`, data);
};
export const updateAdminUser = async (data) => {
  return await instance.put(`admin-user/update-admin`, data);
};
export const deleteAdminUser = async (id) => {
  return await instance.delete(`admin-user/delete-admin/${id}`);
};

// Vendor
export const getAllVendor = (id, data) => {
  if (id !== "") {
    return instance.get(`vendor/get-vendor/${id}`);
  } else {
    return instance.get(`vendor/get-all-vendor${data}`);
  }
};

export const updateVendor = (data) => {
  return instance.put(`vendor/update-vendor`, data);
};
export const deleteVendor = async (id) => {
  return await instance.delete(`vendor/delete-vendor/${id}`);
};

// Orders
export const getAllOrders = async (id, data) => {
  if (id !== "") {
    return await instance.get(`order/get-order/${id}`);
  } else {
    return await instance.get(`order/get-all-orders${data}`);
  }
};
export const deleteOrders = (id) => {
  return instance.delete(`order/delete-order/${id}`);
};
export const updateOrders = (data) => {
  return instance.put(`order/update-order`,data);
};

// support
export const getAllSupport = (id, data) => {
  if (id !== "") {
    return instance.get(`support-query/get-query/${id}`);
  } else {
    return instance.get(`support-query/get-all-query${data}`);
  }
};

export const createSupport = (data) => {
  return instance.put("support-query/update-query", data);
};
export const deleteSupport = (data) => {
  return instance.delete(`support-query/delete-query/${data}`);
};

// Banner
export const createBanner = (data) => {
  return instance.post("banner/create-banner", data);
};

export const getAllBanner = (id, data) => {
  if (id !== "") {
    return instance.get(`banner/get-banner/${id}`);
  } else {
    return instance.get(`banner/get-all-banner${data}`);
  }
};

export const updateBanner = (data) => {
  return instance.put("banner/update-banner", data);
}
export const deleteBanner = (id) => {
  return instance.delete(`banner/delete-banner/${id}`);
};

// Offers
export const createOfferBanner = (data) => {
  return instance.post("offer-banner/create-banner", data);
};

export const getAllOfferBanner = (id, data) => {
  if (id !== "") {
    return instance.get(`offer-banner/get-banner/${id}`);
  } else {
    return instance.get(`offer-banner/get-all-banner${data}`);
  }
};

export const updateOfferBanner = (data) => {
  return instance.put("offer-banner/update-banner", data);
}
export const deleteOfferBanner = (id) => {
  return instance.delete(`offer-banner/delete-banner/${id}`);
};

// Brands
export const createBrand = (data) => {
  return instance.post("brand/create-brand", data);
};

export const getAllBrand = (id, data) => {
  if (id !== "") {
    return instance.get(`brand/get-brand/${id}`);
  } else {
    return instance.get(`brand/get-all-brand${data}`);
  }
};

export const updateBrand = (data) => {
  return instance.put("brand/update-brand", data);
}
export const deleteBrand = (id) => {
  return instance.delete(`brand/delete-brand/${id}`);
};