import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { deleteCustomer, getCustomer, updateCustomer } from "../../utils/Services";

export const getAllCustomer = createAsyncThunk("Get Customer", async (data) => {
    return await getCustomer("", data).then((response) => response.data)
});
export const getOneCustomer = createAsyncThunk("Get One Customer", async (id) => {
    return await getCustomer(id, "").then((response) => response.data)
});
export const removeCustomer = createAsyncThunk("Delete Customer", async (id) => {
    return await deleteCustomer(id).then((response) => response.data)
});
export const modifyCustomer = createAsyncThunk("Update Vendor", async (data) => {
    return await updateCustomer(data).then((response) => response?.data)
})

export const customerReducer = createSlice({
    name: 'customer',
    initialState: {
        listOfCustomer: [],
        listOneCustomer: [],
        loader: false,
        message: "",
        success: false
    },
    reducers: {
        resetMessage: (state) => {
            state.success = false
            state.loader = false
            state.message = ""
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getAllCustomer.pending, (state) => {
            state.loader = true
        })
        builder.addCase(getAllCustomer.fulfilled, (state, action) => {
            state.loader = false
            state.listOfCustomer = action.payload
        })
        builder.addCase(getOneCustomer.pending, (state) => {
            state.loader = true
        })
        builder.addCase(getOneCustomer.fulfilled, (state, action) => {
            state.loader = false
            state.listOneCustomer = action.payload
        })
        builder.addCase(removeCustomer.pending, (state) => {
            state.loader = true
        })
        builder.addCase(removeCustomer.fulfilled, (state, action) => {
            state.loader = false
            state.listOfCustomer = state?.listOfCustomer?.data?.filter((rows) => rows?.id !== action.payload.id)
            state.success = action.payload?.success
            state.message = action.payload?.message;
        })
        builder.addCase(modifyCustomer.pending, (state) => {
            state.loader = true
        })
        builder.addCase(modifyCustomer.fulfilled, (state, action) => {
            state.loader = false
            state.success = action.payload?.success
            state.message = action.payload?.message
            state.listOfCustomer.push(action.payload)
        })
        builder.addCase(modifyCustomer.rejected, (state, action) => {
            state.loader = false
            state.success = false
            state.message = action?.payload?.message
        })
    }
})

export const { resetMessage } = customerReducer.actions
export default customerReducer.reducer