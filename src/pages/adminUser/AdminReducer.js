import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createAdminUser, getAllAdminUser } from "../../utils/Services";

export const getAllUserData = createAsyncThunk("GetAllUserData", async () => {
    return await getAllAdminUser().then((response) => response?.data)
})
export const addUserData = createAsyncThunk("AddUserData", async (data) => {
    return await createAdminUser(data).then((response) => response?.data)
})

export const adminUser = createSlice({
    name: "adminUser",
    initialState: {
        adminData: [],
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
    }
})


export default adminUser.reducer;