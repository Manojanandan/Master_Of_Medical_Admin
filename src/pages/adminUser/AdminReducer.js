import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createAdminUser, getAllAdminUser, updateAdminUser } from "../../utils/Services";

export const getAllUserData = createAsyncThunk("GetAllUserData", async (pgNum) => {  
    return await getAllAdminUser("",pgNum).then((response) => response?.data)
})
export const getOneUserData = createAsyncThunk("GetOneUserData", async (id) => {  
    return await getAllAdminUser(id,"").then((response) => response?.data)
})
export const addUserData = createAsyncThunk("AddUserData", async (data) => {
    return await createAdminUser(data).then((response) => response?.data)
})
export const putUserData = createAsyncThunk("UpdateUserData", async (data) => {
    return await updateAdminUser(data).then((response) => response?.data)
})

export const adminUser = createSlice({
    name: "adminUser",
    initialState: {
        adminData: [],
        adminOneData: [],
        loader: false,
        createAdmin:[],
        message:"",
        success: false
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllUserData.pending, (state) => {
            state.loader = true
        })
        builder.addCase(getAllUserData.fulfilled, (state, action) => {
            state.loader = false;
            state.adminData = action.payload
        })
        builder.addCase(getAllUserData.rejected, (state) => {
            state.loader = false
        })
        builder.addCase(getOneUserData.pending, (state) => {
            state.loader = true
        })
        builder.addCase(getOneUserData.fulfilled, (state, action) => {
            state.loader = false;
            state.adminOneData = action.payload
        })
        builder.addCase(getOneUserData.rejected, (state) => {
            state.loader = false
        })
        builder.addCase(addUserData.pending,(state)=>{
            state.loader = true
        })
        builder.addCase(addUserData.fulfilled,(state,action)=>{
            state.loader = false
            state.createAdmin.push(action.payload)
            state.success = action.payload?.success
            state.message = action.payload?.message
        })
        builder.addCase(addUserData.rejected,(state,action)=>{
            state.loader = false
            state.success = action.payload?.success
            state.message = action.payload?.message
        })
        builder.addCase(putUserData.pending,(state)=>{
            state.loader = true
        })
        builder.addCase(putUserData.fulfilled,(state,action)=>{
            state.loader = false
            state.createAdmin.push(action.payload)
            state.success = action.payload?.success
            state.message = action.payload?.message
        })
        builder.addCase(putUserData.rejected,(state,action)=>{
            state.loader = false
            state.success = action.payload?.success
            state.message = action.payload?.message
        })
    }
})


export default adminUser.reducer;