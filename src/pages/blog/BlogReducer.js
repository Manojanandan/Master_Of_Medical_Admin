import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addBlog, deleteBlog, editBlog, getBlog } from "../../utils/Services";

export const getBlogData = createAsyncThunk("GetBlogData", async (pgNum) => {
    return await getBlog("", pgNum).then((response) => response.data)
})
export const postBlogData = createAsyncThunk("postBlogData", async (data) => {
    return await addBlog(data).then((response) => response?.data)
})
export const getOneBlogData = createAsyncThunk("GetOneBlogData", async (id) => {
    return await getBlog(id, "").then((response) => response?.data)
})
export const putBlogData = createAsyncThunk("PutBlogData", async (data) => {
    return await editBlog(data).then((response) => response?.data)
})
export const deleteBlogData = createAsyncThunk("DeleteBlogData", async (id) => {
    return await deleteBlog(id).then((response) => response?.data)
})


export const blogReducer = createSlice({
    name: "Blog Reducer",
    initialState: {
        getAllBog: [],
        addBlog: {
            title: "", author: "", content: "", metaTitle: "", metaDescription: "", image: ""
        },
        getOneData: [],
        load: false,
        message: '',
        success: false
    },
    reducers: {
        resetMessage: (state) => {
            state.message = "";
            state.getOneData = {};
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getBlogData.pending, (state, action) => {
            state.load = true;
            state.message = "";
        })
        builder.addCase(getBlogData.fulfilled, (state, action) => {
            state.load = false;
            state.getAllBog = action.payload;
            state.success = action.payload?.success
            state.message = action.payload.message;
        })
        builder.addCase(postBlogData.pending, (state, action) => {
            state.load = true;
            state.message = "";
        })
        builder.addCase(postBlogData.fulfilled, (state, action) => {
            state.load = false;
            state.addBlog.title = action.payload.title;
            state.addBlog.author = action.payload.author;
            state.addBlog.content = action.payload.content;
            state.addBlog.image = action.payload.image;
            state.addBlog.metaTitle = action.payload.metaTitle;
            state.addBlog.metaDescription = action.payload.metaDescription;
            state.success = action.payload?.success
            state.message = action.payload.message;
        })
        builder.addCase(getOneBlogData.pending, (state, action) => {
            state.load = true;
            state.message = "";
        })
        builder.addCase(getOneBlogData.fulfilled, (state, action) => {
            state.load = false;
            state.getOneData = action.payload;
        })
        builder.addCase(putBlogData.pending, (state, action) => {
            state.load = true;
            state.message = "";
        })
        builder.addCase(putBlogData.fulfilled, (state, action) => {
            state.load = false;
            state.addBlog.title = action.payload.title;
            state.addBlog.author = action.payload.author;
            state.addBlog.content = action.payload.content;
            state.addBlog.image = action.payload.image;
            state.addBlog.metaTitle = action.payload.metaTitle;
            state.addBlog.metaDescription = action.payload.metaDescription;
            state.success = action.payload?.success

            state.message = action.payload.message;
        })
        builder.addCase(deleteBlogData.pending, (state, action) => {
            state.load = true;
            state.message = "";
        })
        builder.addCase(deleteBlogData.fulfilled, (state, action) => {
            state.load = false;
            state.getAllBog = state?.getAllBog?.data?.filter((rows) => rows?.id !== action.payload.id);
            state.success = action.payload?.success
            state.message = action.payload.message;
        })
    }
})

export const { resetMessage } = blogReducer.actions
export default blogReducer.reducer