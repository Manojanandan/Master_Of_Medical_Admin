import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addTestimonial, deleteTestimonial, editTestimonial, getTestimonial } from '../../utils/Services'


export const postTestimonial = createAsyncThunk("PostTestimonial", async (data) => {
    return await addTestimonial(data).then((response) => response.data)
})
export const getDataTestimonial = createAsyncThunk("GetTestimonial", async(pgNum) => {
    return await getTestimonial("",pgNum).then((response) => response.data)
})
export const getOneDataTestimonial = createAsyncThunk("GetOneDataTestimonial", async (id) => {
    return await getTestimonial(id, "").then((response) => response.data)
})
export const putTestimonial = createAsyncThunk("PutTestimonial", async (data) => {
    return await editTestimonial(data).then((response) => response.data)
})
export const deleteTestimonialData = createAsyncThunk("DeleteTestimonial", async (id) => {
    return await deleteTestimonial(id).then((response) => response.data)
})


export const testimonialReducer = createSlice({
    name: "Testimonial",
    initialState: {
        getTestimonialData: [],
        addTestimonial: {
            name: '', message: '', designation: '', image: ''
        },
        loader: false,
        message: "",
        getOneData: []
    },
    reducers: {
        resetMessage: (state) => {
            state.message = ""
            state.getOneData = []
        },
        getDataOne: (state) => {
            state.getOneData = []
        }
    },
    extraReducers: (builder) => {
        builder.addCase(postTestimonial.pending, (state, action) => {
            state.loader = true;
            state.message = ""
        })
        builder.addCase(postTestimonial.fulfilled, (state, action) => {
            state.loader = false
            state.addTestimonial.name = action.payload.name;
            state.addTestimonial.message = action.payload.message;
            state.addTestimonial.designation = action.payload.designation;
            state.addTestimonial.image = action.payload.image;
            state.message = action.payload.message
        })
        builder.addCase(getDataTestimonial.pending, (state, action) => {
            state.loader = true
        })
        builder.addCase(getDataTestimonial.fulfilled, (state, action) => {
            state.loader = false
            state.getTestimonialData = action.payload
        })
        builder.addCase(getOneDataTestimonial.pending, (state, action) => {
            state.loader = true
            state.getOneData = []
        })
        builder.addCase(getOneDataTestimonial.fulfilled, (state, action) => {
            state.loader = false
            state.getOneData = action.payload
        })
        builder.addCase(putTestimonial.pending, (state, action) => {
            state.loader = true
            state.message = ""
        })
        builder.addCase(putTestimonial.fulfilled, (state, action) => {
            state.loader = false
            state.addTestimonial.name = action.payload.name
            state.addTestimonial.message = action.payload.message
            state.addTestimonial.designation = action.payload.designation
            state.addTestimonial.image = action.payload.image
            state.message = action.payload.message
        })
        builder.addCase(deleteTestimonialData.pending, (state, action) => {
            state.loader = true
        })
        builder.addCase(deleteTestimonialData.fulfilled, (state, action) => {
            state.loader = false
            state.getTestimonialData = state.getTestimonialData?.data.filter(
                testimonial => testimonial.id !== action.payload.data.id
            );
            state.message = action.payload.message
        })
    }
})

export const { resetMessage, getDataOne } = testimonialReducer.actions
export default testimonialReducer.reducer