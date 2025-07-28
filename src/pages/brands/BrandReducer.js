import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createBrand, getAllBrand, updateBrand } from "../../utils/Services";

export const addBrand = createAsyncThunk("Add Brand", async (data) => {
    return await createBrand(data).then((res) => {
        res?.data
    })
})
export const editBrand = createAsyncThunk("Edit Brand", async (data) => {
    return await updateBrand(data).then((res) => {
        res?.data
    })
})
export const fetchAllBrand = createAsyncThunk("Get Brand", async (data) => {
    return await getAllBrand("", data).then((res) => {
        res?.data
    })
})
export const fetchOneBrand = createAsyncThunk("Get One Brand", async (data) => {
    return await getAllBrand(data, "").then((res) => {
        res?.data
    })
})

export const brandReducer = createSlice({
    name: 'brands',
    initialState: {
        createBrandData: [],
        getAllBrandData: [],
        getOneBrandData: [],
        loader: false,
        message: "",
        success: false,
    },
    reducers: {
        resetMessage: (state) => {
            state.message = ""
            state.success = false
        }
    },
    extraReducers: (builder) => {
        builder.addCase(addBrand.pending, (state) => {
            state.loader = true;
        })
        builder.addCase(addBrand.fulfilled, (state, action) => {
            state.loader = false;
            state.createBrandData.push(action.payload);
            state.message = action?.payload?.message;
            state.success = action?.payload?.message;
        })
        builder.addCase(addBrand.rejected, (state, action) => {
            state.loader = false;
            state.message = action.error.message;
            state.success = false;
        })
        builder.addCase(editBrand.pending, (state) => {
            state.loader = true;
        })
        builder.addCase(editBrand.fulfilled, (state, action) => {
            state.loader = false;
            state.createBrandData.push(action.payload);
            state.message = action?.payload?.message;
            state.success = action?.payload?.message;
        })
        builder.addCase(editBrand.rejected, (state, action) => {
            state.loader = false;
            state.message = action.error.message;
            state.success = false;
        })
        builder.addCase(fetchAllBrand.pending, (state) => {
            state.loader = true;
        })
        builder.addCase(fetchAllBrand.fulfilled, (state, action) => {
            state.loader = false;
            state.getAllBrandData = action.payload;
            state.message = action?.payload?.message;
            state.success = action?.payload?.success;
        })
        builder.addCase(fetchOneBrand.pending, (state) => {
            state.loader = true;
        })
        builder.addCase(fetchOneBrand.fulfilled, (state, action) => {
            state.loader = false;
            state.getOneBrandData = action.payload;
            state.message = action?.payload?.message;
            state.success = action?.payload?.success;
        })

    }
})

export const { resetMessage } = brandReducer.actions;
export default brandReducer.reducer;