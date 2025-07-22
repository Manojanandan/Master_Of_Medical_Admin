import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createSupport,
  deleteSupport,
  getAllSupport,
} from "../../utils/Services";

export const viewallSupport = createAsyncThunk("Get All", async (data) => {
  return await getAllSupport("", data).then((response) => response?.data);
});
export const viewOneSupport = createAsyncThunk("Get One", async (data) => {
  return await getAllSupport(data, "").then((response) => response?.data);
});
export const updateSupport = createAsyncThunk("Add Support", async (data) => {
  return await createSupport(data).then((response) => response?.data);
});
export const removeSupport = createAsyncThunk(
  "Delete Support",
  async (data) => {
    return await deleteSupport(data).then((response) => response?.data);
  }
);

export const supportReducer = createSlice({
  name: "support",
  initialState: {
    createSupport: [],
    getAllSupport: [],
    getOneSupport: [],
    loader: false,
    message: "",
    success: false,
  },
  reducers: {
    resetMessage: (state) => {
      (state.message = ""), (state.success = false);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(viewallSupport.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(viewallSupport.fulfilled, (state, action) => {
      state.loader = false;
      state.getAllSupport = action?.payload;
      state.message = action?.payload?.message;
      state.success = action?.payload?.success;
    });
    builder.addCase(viewallSupport.rejected, (state, action) => {
      state.loader = false;
      state.message = action?.payload?.message;
      state.success = action?.payload?.success;
    });
    builder.addCase(viewOneSupport.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(viewOneSupport.fulfilled, (state, action) => {
      state.loader = false;
      state.getOneSupport = action?.payload;
      state.message = action?.payload?.message;
      state.success = action?.payload?.success;
    });
    builder.addCase(viewOneSupport.rejected, (state, action) => {
      state.loader = false;
      state.message = action?.payload?.message;
      state.success = action?.payload?.success;
    });
    builder.addCase(updateSupport.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(updateSupport.fulfilled, (state, action) => {
      state.loader = false;
      state.createSupport.push(action?.payload);
      state.message = action?.payload?.message;
      state.success = action?.payload?.success;
    });
    builder.addCase(updateSupport.rejected, (state, action) => {
      state.loader = false;
      state.message = action?.payload?.message;
      state.success = action?.payload?.success;
    });
    builder.addCase(removeSupport.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(removeSupport.fulfilled, (state, action) => {
      state.loader = false;
      state.getAllSupport = state?.getAllSupport?.data?.filter(
        (rows) => rows?.id !== action.payload.id
      );
      state.success = action.payload?.success;
      state.message = action.payload?.message;
    });
    builder.addCase(removeSupport.rejected, (state, action) => {
      state.loader = false;
      state.success = action.payload?.success;
      state.message = action.payload?.message;
    });
  },
});

export const { resetMessage } = supportReducer.actions;
export default supportReducer.reducer;
