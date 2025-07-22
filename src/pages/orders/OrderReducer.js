import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { deleteOrders, getAllOrders, updateOrders } from "../../utils/Services";

export const listOfAllOrders = createAsyncThunk(
  "Get ALL Orders",
  async (data) => {
    return await getAllOrders("", data).then((response) => response?.data);
  }
);
export const getOrders = createAsyncThunk("Get One Orders", async (data) => {
  return await getAllOrders(data, "").then((response) => response?.data);
});
export const removeOrders = createAsyncThunk("Delete Orders", async (data) => {
  return await deleteOrders(data).then((response) => response?.data);
});
export const modifyOrders = createAsyncThunk("Update Orders", async (data) => {
  return await updateOrders(data).then((response) => response?.data);
});

export const orderReducer = createSlice({
  name: "orders",
  initialState: {
    getAllOrders: [],
    getOneOrders: [],
    createOrders: [],
    loader: false,
    success: false,
    message: "",
  },
  reducers: {
    resetMessage: (state) => {
      state.success = false;
      state.loader = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(listOfAllOrders.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(listOfAllOrders.fulfilled, (state, action) => {
      state.loader = false;
      state.getAllOrders = action.payload;
    });
    builder.addCase(getOrders.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(getOrders.fulfilled, (state, action) => {
      state.loader = false;
      state.getOneOrders = action.payload;
    });
    builder.addCase(removeOrders.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(removeOrders.fulfilled, (state, action) => {
      state.loader = false;
      state.getAllOrders = state?.getAllOrders?.data?.filter(
        (item) => item?.id !== action?.payload?.id
      );
      state.success = action.payload?.success;
      state.message = action.payload?.message;
    });
    builder.addCase(removeOrders.rejected, (state, action) => {
      state.loader = false;
      state.success = action.payload?.success;
      state.message = action.payload?.message;
    });
    builder.addCase(modifyOrders.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(modifyOrders.fulfilled, (state, action) => {
      state.loader = false;
      state.createOrders.push(action.payload);
      state.success = action.payload?.success;
      state.message = action.payload?.message;
    });
    builder.addCase(modifyOrders.rejected, (state, action) => {
      state.loader = false;
      state.success = action.payload?.success;
      state.message = action.payload?.message;
    });
  },
});

export const { resetMessage } = orderReducer.actions;
export default orderReducer.reducer;
