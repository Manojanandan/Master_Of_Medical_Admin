import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { deleteVendor, getAllVendor, updateVendor } from "../../utils/Services";

export const getVendor = createAsyncThunk("Get Vendor", async (data) => {
    return await getAllVendor("", data).then((response) => response.data)
})
export const getOneVendor = createAsyncThunk("Get One Vendor", async (data) => {
    return await getAllVendor(data, "").then((response) => response.data)
})
export const modifyVendor = createAsyncThunk("Update Vendor", async (data) => {
    return await updateVendor(data).then((response) => response?.data)
})
export const removeVendor = createAsyncThunk("Delete Customer", async (id) => {
    return await deleteVendor(id).then((response) => response?.data)
})

export const vendorReducer = createSlice({
    name: 'vendor',
    initialState: {
        listOfVendor: [],
        vendorOneData: [],
        createVendor: [],
        loader: false,
        message: "",
        success: false
    },
    reducers: {
        resetMessage: (state) => {
            state.success = false
            state.message = ""
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getVendor.pending, (state) => {
            state.loader = true
        })
        builder.addCase(getVendor.fulfilled, (state, action) => {
            state.loader = false
            state.listOfVendor = action.payload
        })
        builder.addCase(getOneVendor.pending, (state) => {
            state.loader = true
        })
        builder.addCase(getOneVendor.fulfilled, (state, action) => {
            state.loader = false
            state.vendorOneData = action.payload
        })
        builder.addCase(modifyVendor.pending, (state) => {
            state.loader = true
        })
        builder.addCase(modifyVendor.fulfilled, (state, action) => {
            state.loader = false
            state.createVendor.push(action.payload)
            state.message = action.payload?.message
            state.success = action.payload?.success
        })
        builder.addCase(modifyVendor.rejected, (state, action) => {
            state.loader = false
            state.message = action.payload?.message
            state.success = action.payload?.success
        })
        builder.addCase(removeVendor.pending, (state) => {
            state.loader = true
        })
        builder.addCase(removeVendor.fulfilled, (state, action) => {
            state.loader = false
            state.listOfVendor = state?.listOfVendor?.data?.filter((rows) => rows?.id !== action.payload.id)
            state.success = action.payload?.success
            state.message = action.payload?.message
        })
        builder.addCase(removeVendor.rejected, (state, action) => {
            state.loader = false
            state.success = action.payload?.success
            state.message = action.payload?.message
        })
    }
})


export const { resetMessage } = vendorReducer.actions
export default vendorReducer.reducer