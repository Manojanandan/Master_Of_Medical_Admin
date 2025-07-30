import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  categoryList,
  createProduct,
  deleteProduct,
  getAllProduct,
  subCategoryList,
  updateProduct,
} from "../../utils/Services";

export const getProductList = createAsyncThunk("GETProduct", async (data) => {
  return await getAllProduct("", data).then((response) => response?.data);
});
export const getOneProductList = createAsyncThunk(
  "GETOneProduct",
  async (id) => {
    return await getAllProduct(id, "").then((response) => response?.data);
  }
);
export const getCategory = createAsyncThunk("Get Category", async () => {
  return await categoryList().then((response) => response?.data);
});
export const getSubCategory = createAsyncThunk(
  "Get sub Category",
  async (id) => {
    return await subCategoryList(id).then((response) => response?.data);
  }
);
export const addProduct = createAsyncThunk(
  "AddProduct",
  async (id, { rejectWithValue }) => {
    try {
      const response = await createProduct(id);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data || {
          message: "Something went wrong",
          success: false,
        }
      );
    }
  }
);
export const editProduct = createAsyncThunk(
  "EditProduct",
  async (id, { rejectWithValue }) => {
    try {
      const response = await updateProduct(id);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data || {
          message: "Something went wrong",
          success: false,
        }
      );
    }
  }
);
export const removeProduct = createAsyncThunk(
  "delete product",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteProduct(id);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data || {
          message: "Something went wrong",
          success: false,
        }
      );
    }
  }
);

export const productReducer = createSlice({
  name: "productReducer",
  initialState: {
    createProduct: [],
    getOneData: [],
    getProduct: [],
    categoryData: [],
    subCategoryData: [],
    loader: false,
    successMsg: "",
    success: false,
  },
  reducers: {
    resetMessage: (state) => {
      state.success = false;
      state.loader = false;
      state.successMsg = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addProduct.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(addProduct.fulfilled, (state, action) => {
      state.loader = false;
      state.createProduct.push(action.payload);
      state.success = action.payload?.success;
      state.successMsg = action.payload?.message;
    });
    builder.addCase(addProduct.rejected, (state, action) => {
      state.loader = false;
      state.success = action.payload?.success;
      state.successMsg = action.payload?.message;
    });
    builder.addCase(editProduct.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(editProduct.fulfilled, (state, action) => {
      state.loader = false;
      state.createProduct.push(action.payload);
      state.successMsg = action.payload?.message;
      state.success = action.payload?.success;
    });
    builder.addCase(editProduct.rejected, (state, action) => {
      state.loader = false;
      state.success = action.payload?.success;
      state.successMsg = action.payload?.message;
    });
    builder.addCase(getProductList.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(getProductList.fulfilled, (state, action) => {
      state.loader = false;
      state.getProduct = action.payload;
    });
    builder.addCase(getOneProductList.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(getOneProductList.fulfilled, (state, action) => {
      state.loader = false;
      state.getOneData = action.payload;
    });
    builder.addCase(getOneProductList.rejected, (state) => {
      state.loader = false;
    });
    builder.addCase(getCategory.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(getCategory.fulfilled, (state, action) => {
      state.loader = false;
      state.categoryData = action.payload;
    });
    builder.addCase(getSubCategory.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(getSubCategory.fulfilled, (state, action) => {
      state.loader = false;
      state.subCategoryData = action.payload;
    });
    builder.addCase(removeProduct.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(removeProduct.fulfilled, (state, action) => {
      state.loader = false;
      state.getProduct = state?.getProduct?.data?.filter(
        (rows) => rows?.id !== action.payload.id
      );
      state.success = true;
      state.successMsg = action.payload?.message;
    });
    builder.addCase(removeProduct.rejected, (state, action) => {
      state.loader = false;
      state.success = false;
      state.successMsg = action.payload?.message;
    });
  },
});

export const { resetMessage } = productReducer.actions;
export default productReducer.reducer;
