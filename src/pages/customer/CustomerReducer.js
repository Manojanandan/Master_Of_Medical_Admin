import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCustomer } from "../../utils/Services";

export const getAllCustomer = createAsyncThunk("Get Customer",async(pgNum)=>{
    return await getCustomer("",pgNum).then((response)=>response.data)
})

export const customerReducer = createSlice({
    name: 'customer',
    initialState:{
        listOfCustomer:[],
        loader: false,
    },
    reducer:{},
    extraReducers:(builder)=>{
        builder.addCase(getAllCustomer.pending,(state)=>{
            state.loader = true
        })
        builder.addCase(getAllCustomer.fulfilled,(state,action)=>{
            state.loader = false
            state.listOfCustomer = action.payload                
        })
    }
})

export default customerReducer.reducer