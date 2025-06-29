import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createProduct } from "../../utils/Services";

export const addProduct = createAsyncThunk("AddProduct",async(data)=>{
    return await createProduct(data).then((response) => response?.data)
})

export const productReducer = createSlice({
    name: "productReducer",
    initialState:{
        createProduct:[],
        loader: false,
        successMsg:"",
        success: false
    },
    reducer:{},
    extraReducers:(builder)=>{
        builder.addCase(addProduct.pending,(state)=>{
            state.loader = true
        })
        builder.addCase(addProduct.fulfilled,(state,action)=>{
            state.loader = false
            state.createProduct.push(action.payload)
            state.successMsg = action.payload?.message
            state.success = action.payload?.success
        })
        builder.addCase(addProduct.rejected,(state,action)=>{
            state.loader = false;
            state.success = action.payload?.success
            state.successMsg = action.payload?.message
        })
    }
})

export default productReducer.reducer