import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userLogin } from "../../utils/Services";


export const loginUser = createAsyncThunk("Login User",async({data,type})=>{
    return await userLogin(data,type).then((response) => response.data)
})

export const loginReducer = createSlice({
    name: 'login',
    initialState: {
        loginReducer: {
            email: "",
            passowrd: "",
        },
        loader: false,
        message: "",
        success: false,
    },
    reducer: {},
    extraReducers: (builder)=>{
        builder.addCase(loginUser.pending,(state)=>{
            state.loader = true;
        })
        builder.addCase(loginUser.fulfilled,(state,action)=>{
            state.loader= false
            state.loginReducer.email = action.payload.email
            state.loginReducer.passowrd = action.payload.passowrd
            state.success = action.payload?.success
            state.message = action.payload.message
            sessionStorage.setItem("jwt", action.payload.accessToken); 
        })
        builder.addCase(loginUser.rejected,(state,action)=>{
            state.loader = false
            state.success = false
            state.message = action?.error?.message
        })
    }
})

export default loginReducer.reducer