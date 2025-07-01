import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createProduct, getAllProduct } from "../../utils/Services";

export const getProductList = createAsyncThunk("GETProduct",async()=>{
    return await getAllProduct().then((response) => response?.data)
})
export const addProduct = createAsyncThunk("AddProduct",async(data)=>{
    return await createProduct(data).then((response) => response?.data)
})

export const productReducer = createSlice({
    name: "productReducer",
    initialState:{
        createProduct:[],
        getProduct:[],
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
         builder.addCase(getProductList.pending,(state)=>{
            state.loader = true
        })
        builder.addCase(getProductList.fulfilled,(state,action)=>{
            state.loader = false
            state.getProduct = action.payload
        })
    }
})

export default productReducer.reducer