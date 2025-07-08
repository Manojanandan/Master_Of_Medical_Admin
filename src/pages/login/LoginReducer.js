import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userLogin } from "../../utils/Services";

export const loginUser = createAsyncThunk("login/user", async (data) => {
  const response = await userLogin(data);
  return response.data;
});

export const loginReducer = createSlice({
  name: "login",
  initialState: {
    loginReducer: {
      email: "",
      password: "",
    },
    loader: false,
    message: "",
    success: false,
  },

  reducers: {
    resetLoginState: (state) => {
      state.loader = false;
      state.success = false;
      state.message = "";
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loader = true;
        state.success = false;
        state.message = "";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loader = false;
        state.success = action.payload?.success ?? true;
        state.message = action.payload;

        if (action.payload?.accessToken) {
          sessionStorage.setItem("jwt", action.payload.accessToken);
        }
        state.loginReducer.email = action.payload?.email || "";
        state.loginReducer.password = ""; 
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loader = false;
        state.success = false;
        state.message = action.error.message || "Login failed";
      });
  },
});


export const { resetLoginState } = loginReducer.actions;
export default loginReducer.reducer;
