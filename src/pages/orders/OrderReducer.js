import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllOrders } from "../../utils/Services";
import { resetMessage } from "../vendor/VendorReducer";

export const listOfAllOrders = createAsyncThunk("Get ALL Orders", async (data) => {
    return await getAllOrders("", data).then((response) => response?.data)
})
export const removeOrders = createAsyncThunk("Delete Orders", async (data) => {
    return await deleteOrders(data).then((response) => response?.data)
})

export const orderReducer = createSlice({
    name: "orders",
    initialState: {
        getAllOrders: [],
        loader: false,
        success: false,
        message: ""
    },
    reducers: {
        resetMessage: (state) => {
            state.success = false
            state.loader = false
            state.message = ""
        }
    },
    extraReducers: (builder) => {
        builder.addCase(listOfAllOrders.pending, (state) => {
            state.loader = true
        })
        builder.addCase(listOfAllOrders.fulfilled, (state, action) => {
            state.loader = false
            state.getAllOrders = action.payload
        })
        builder.addCase(removeOrders.pending, (state) => {
            state.loader = true
        })
        builder.addCase(removeOrders.fulfilled, (state, action) => {
            state.loader = false
            state.getAllOrders = state?.getAllOrders?.data?.filter((item) => item?.id !== action?.payload?.id)
            state.success = action.payload?.success
            state.message = action.payload?.message
        })
         builder.addCase(removeOrders.rejected, (state, action) => {
            state.loader = false
            state.success = action.payload?.success
            state.message = action.payload?.message
        })
    }
})

export const { resetMessage } = orderReducer.actions
export default orderReducer.reducer