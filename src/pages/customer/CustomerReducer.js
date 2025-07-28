import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { deleteCustomer, getCustomer, updateCustomer } from "../../utils/Services";

export const getAllCustomer = createAsyncThunk("Get Customer", async (data) => {
    return await getCustomer("", data).then((response) => response.data)
});
export const getOneCustomer = createAsyncThunk("Get One Customer", async (id) => {
    return await getCustomer(id, "").then((response) => response.data)
});
export const removeCustomer = createAsyncThunk(
    "Delete Customer",
    async (id, { rejectWithValue }) => {
        try {
            const response = await deleteCustomer(id);
            return response.data;
        } catch (err) {
            return rejectWithValue(err?.response?.data || { message: "Something went wrong", success: false });
        }
    }
);
export const modifyCustomer = createAsyncThunk(
    "Update Vendor",
    async (data, { rejectWithValue }) => {
        try {
            const response = await updateCustomer(data);
            return response.data;
        } catch (err) {
            const message =
                err?.response?.data?.message || err.message || "Something went wrong";
            const success = err?.response?.data?.success ?? false;
            return rejectWithValue({ message, success });
        }
    }
);

export const customerReducer = createSlice({
    name: 'customer',
    initialState: {
        listOfCustomer: [],
        listOneCustomer: [],
        createCustomer: [],
        loader: false,
        message: "",
        success: false
    },
    reducers: {
        resetMessage: (state) => {
            state.success = false
            state.loader = false
            state.message = ""
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getAllCustomer.pending, (state) => {
            state.loader = true
        })
        builder.addCase(getAllCustomer.fulfilled, (state, action) => {
            state.loader = false
            state.listOfCustomer = action.payload
        })
        builder.addCase(getOneCustomer.pending, (state) => {
            state.loader = true
        })
        builder.addCase(getOneCustomer.fulfilled, (state, action) => {
            state.loader = false
            state.listOneCustomer = action.payload
        })
        builder.addCase(removeCustomer.pending, (state) => {
            state.loader = true
        })
        builder.addCase(removeCustomer.fulfilled, (state, action) => {
            state.loader = false
            state.listOfCustomer = state?.listOfCustomer?.data?.filter((rows) => rows?.id !== action.payload.id)
            state.success = action.payload?.success
            state.message = action.payload?.message;
        })
        builder.addCase(removeCustomer.rejected, (state, action) => {
            state.loader = false
            state.success = false
            state.message = action.payload?.message;
        })
        builder.addCase(modifyCustomer.pending, (state) => {
            state.loader = true
        })
        builder.addCase(modifyCustomer.fulfilled, (state, action) => {
            state.loader = false
            state.createCustomer.push(action.payload)
            state.success = action.payload?.success
            state.message = action.payload?.message
        })
        builder.addCase(modifyCustomer.rejected, (state, action) => {
            state.loader = false;
            state.success = false;
            state.message = action.payload?.message || "Something went wrong";
        })
    }
})

export const { resetMessage } = customerReducer.actions
export default customerReducer.reducer