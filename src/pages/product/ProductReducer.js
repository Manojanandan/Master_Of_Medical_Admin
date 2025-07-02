import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createProduct, getAllProduct, updateProduct } from "../../utils/Services";

export const getProductList = createAsyncThunk("GETProduct",async(pgNum)=>{
    return await getAllProduct("",pgNum).then((response) => response?.data)
})
export const getOneProductList = createAsyncThunk("GETOneProduct", async (id) => {
    return await getAllProduct(id,"").then((response) => response?.data)
})
export const addProduct = createAsyncThunk("AddProduct",async(data)=>{
    return await createProduct(data).then((response) => response?.data)
})
export const editProduct = createAsyncThunk("EditProduct",async(data)=>{
    return await updateProduct(data).then((response) => response?.data)
})

export const productReducer = createSlice({
    name: "productReducer",
    initialState:{
        createProduct:[],
        getOneData:[],
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
        builder.addCase(editProduct.pending,(state)=>{
            state.loader = true
        })
        builder.addCase(editProduct.fulfilled,(state,action)=>{
            state.loader = false
            state.createProduct.push(action.payload)
            state.successMsg = action.payload?.message
            state.success = action.payload?.success
        })
        builder.addCase(editProduct.rejected,(state,action)=>{
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
        builder.addCase(getOneProductList.pending,(state)=>{
            state.loader = true
        })
         builder.addCase(getOneProductList.fulfilled,(state,action)=>{
            state.loader = false
            state.getOneData = action.payload
        })
        builder.addCase(getOneProductList.rejected,(state)=>{
            state.loader = false
        })
    }
})

export default productReducer.reducer