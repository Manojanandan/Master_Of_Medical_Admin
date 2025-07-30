import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createOfferBanner,
  deleteOfferBanner,
  getAllOfferBanner,
  updateOfferBanner,
} from "../../utils/Services";

export const addOfferBanner = createAsyncThunk(
  "Add Offer Banner",
  async (data, { rejectWithValue }) => {
    try {
      const response = await createOfferBanner(data);
      return response.data;
    } catch (err) {
      const message =
        err?.response?.data?.message || err.message || "Something went wrong";
      const success = err?.response?.data?.success ?? false;
      return rejectWithValue({ message, success });
    }
  }
);
export const editOfferBanner = createAsyncThunk(
  "Edit Offer Banner",
  async (data, { rejectWithValue }) => {
    try {
      const response = await updateOfferBanner(data);
      return response.data;
    } catch (err) {
      const message =
        err?.response?.data?.message || err.message || "Something went wrong";
      const success = err?.response?.data?.success ?? false;
      return rejectWithValue({ message, success });
    }
  }
);
export const fetchAllOfferBanner = createAsyncThunk(
  "Get Offer Banner",
  async (data) => {
    return await getAllOfferBanner("", data).then((res) => res?.data);
  }
);
export const fetchOneOfferBanner = createAsyncThunk(
  "Get One Offer Banner",
  async (data) => {
    return await getAllOfferBanner(data, "").then((res) => res?.data);
  }
);
export const removeOfferBanner = createAsyncThunk(
  "Delete Banner",
  async (data, { rejectWithValue }) => {
    try {
      const response = await deleteOfferBanner(data);
      return response.data;
    } catch (err) {
      const message =
        err?.response?.data?.message || err.message || "Something went wrong";
      const success = err?.response?.data?.success ?? false;
      return rejectWithValue({ message, success });
    }
  }
);

export const offerBannerReducer = createSlice({
  name: "OfferBanners",
  initialState: {
    createOfferBannerData: [],
    getAllOfferBannerData: [],
    getOfferOneBannerData: [],
    loader: false,
    message: "",
    success: false,
  },
  reducers: {
    resetMessage: (state) => {
      state.message = "";
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addOfferBanner.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(addOfferBanner.fulfilled, (state, action) => {
      state.loader = false;
      state.createOfferBannerData.push(action.payload);
      state.message = action?.payload?.message;
      state.success = action?.payload?.message;
    });
    builder.addCase(addOfferBanner.rejected, (state, action) => {
      state.loader = false;
      state.message = action.error.message;
      state.success = false;
    });
    builder.addCase(editOfferBanner.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(editOfferBanner.fulfilled, (state, action) => {
      state.loader = false;
      state.createOfferBannerData.push(action.payload);
      state.message = action?.payload?.message;
      state.success = action?.payload?.message;
    });
    builder.addCase(editOfferBanner.rejected, (state, action) => {
      state.loader = false;
      state.message = action.error.message;
      state.success = false;
    });
    builder.addCase(fetchAllOfferBanner.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(fetchAllOfferBanner.fulfilled, (state, action) => {
      state.loader = false;
      state.getAllOfferBannerData = action.payload;
      state.message = action?.payload?.message;
      state.success = action?.payload?.success;
    });
    builder.addCase(fetchOneOfferBanner.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(fetchOneOfferBanner.fulfilled, (state, action) => {
      state.loader = false;
      state.getOfferOneBannerData = action.payload;
      state.message = action?.payload?.message;
      state.success = action?.payload?.success;
    });
    builder.addCase(removeOfferBanner.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(removeOfferBanner.fulfilled, (state, action) => {
      state.loader = false;
      state.getAllOfferBannerData = state?.getAllOfferBannerData?.data?.filter(
        (rows) => rows?.id !== action.payload.id
      );
      state.success = action.payload?.success;
      state.message = action.payload?.message;
    });
    builder.addCase(removeOfferBanner.rejected, (state, action) => {
      state.loader = false;
      state.success = false;
      state.message = action.payload?.message;
    });
  },
});

export const { resetMessage } = offerBannerReducer.actions;
export default offerBannerReducer.reducer;
