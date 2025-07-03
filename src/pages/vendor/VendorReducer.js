import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllVendor } from "../../utils/Services";

export const getVendor = createAsyncThunk("Get Vendor",async(pgNum)=>{
    return await getAllVendor("",pgNum).then((response)=>response.data)
})

export const vendorReducer = createSlice({
    name: 'vendor',
    initialState:{
        listOfVendor:[],
        loader: false,
    },
    reducer:{},
    extraReducers:(builder)=>{
        builder.addCase(getVendor.pending,(state)=>{
            state.loader = true
        })
        builder.addCase(getVendor.fulfilled,(state,action)=>{
            state.loader = false
            state.listOfVendor = action.payload                
        })
    }
})

export default vendorReducer.reducer