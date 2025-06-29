import instance from './Instance'

// Testimonial Api
export const addTestimonial = (data) => {
    return instance.post('testimonial/create-testimonial', data)
}
export const getTestimonial = (id, pgNum) => {
    if (id) {
        return instance.get(`testimonial/get-testimonial/${id}`)
    }
    if (pgNum !== "") {
        return instance.get(`testimonial/get-all-testimonial?page=${pgNum}&limit=6`)
    }
}
export const editTestimonial = (data) => {
    return instance.put('testimonial/update-testimonial', data)
}
export const deleteTestimonial = (id) => {
    return instance.delete(`testimonial/delete-testimonial/${id}`)
}

// Blog Api
export const getBlog = (id, pageNum) => {
    if (id) {
        return instance.get(`blog/get-blog/${id}`)
    }
    if (pageNum !== "") {
        return instance.get(`blog/get-all-blog?page=${pageNum}&limit=6`)
    }
}

export const addBlog = (data) => {
    return instance.post(`blog/create-blog`, data)
}
export const editBlog = (data) => {
    return instance.put(`blog/update-blog`, data)
}
export const deleteBlog = (id) => {
    return instance.delete(`blog/delete-blog/${id}`)
}

// Customer
export const getCustomer = (id, pageNum) => {
    if (pageNum !== "") {
        return instance.get(`customer/get-all-customer?page=${pageNum}&limit=7`)
    }
}

// Product
export const createProduct = async (data) => {
    return await instance.post('product/create-product', data)
}
export const getAllProduct = async (data) => {
    return await instance.get('product/create-product', data)
}
