import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createBanner, deleteBanner, getAllBanner, updateBanner } from "../../utils/Services";

export const addBanner = createAsyncThunk("Add Banner", async (data, { rejectWithValue }) => {
    try {
        const response = await createBanner(data);
        return response.data;
    } catch (err) {
        const message =
            err?.response?.data?.message || err.message || "Something went wrong";
        const success = err?.response?.data?.success ?? false;
        return rejectWithValue({ message, success });
    }
}
)
export const editBanner = createAsyncThunk("Edit Banner",
    async (data, { rejectWithValue }) => {
        try {
            const response = await updateBanner(data);
            return response.data;
        } catch (err) {
            const message =
                err?.response?.data?.message || err.message || "Something went wrong";
            const success = err?.response?.data?.success ?? false;
            return rejectWithValue({ message, success });
        }
    }
)
export const fetchAllBanner = createAsyncThunk("Get Banner", async (data) => {
    return await getAllBanner("", data).then((res) => res?.data);
});
export const fetchOneBanner = createAsyncThunk("Get One Banner", async (data) => {
    return await getAllBanner(data, "").then((res) => res?.data)
})
export const removeBanner = createAsyncThunk("Delete Banner",
    async (data, { rejectWithValue }) => {
        try {
            const response = await deleteBanner(data);
            return response.data;
        } catch (err) {
            const message =
                err?.response?.data?.message || err.message || "Something went wrong";
            const success = err?.response?.data?.success ?? false;
            return rejectWithValue({ message, success });
        }
    }
)

export const bannerReducer = createSlice({
    name: 'banners',
    initialState: {
        createBannerData: [],
        getAllBannerData: [],
        getOneBannerData: [],
        loader: false,
        message: "",
        success: false,
    },
    reducers: {
        resetMessage: (state) => {
            state.message = ""
            state.success = false
        }
    },
    extraReducers: (builder) => {
        builder.addCase(addBanner.pending, (state) => {
            state.loader = true;
        })
        builder.addCase(addBanner.fulfilled, (state, action) => {
            state.loader = false;
            state.createBannerData.push(action.payload);
            state.message = action?.payload?.message;
            state.success = action?.payload?.message;
        })
        builder.addCase(addBanner.rejected, (state, action) => {
            state.loader = false;
            state.message = action.error.message;
            state.success = false;
        })
        builder.addCase(editBanner.pending, (state) => {
            state.loader = true;
        })
        builder.addCase(editBanner.fulfilled, (state, action) => {
            state.loader = false;
            state.createBannerData.push(action.payload);
            state.message = action?.payload?.message;
            state.success = action?.payload?.message;
        })
        builder.addCase(editBanner.rejected, (state, action) => {
            state.loader = false;
            state.message = action.error.message;
            state.success = false;
        })
        builder.addCase(fetchAllBanner.pending, (state) => {
            state.loader = true;
        })
        builder.addCase(fetchAllBanner.fulfilled, (state, action) => {
            state.loader = false;
            state.getAllBannerData = action?.payload;
            state.message = action?.payload?.message;
            state.success = action?.payload?.success;
        })
        builder.addCase(fetchOneBanner.pending, (state) => {
            state.loader = true;
        })
        builder.addCase(fetchOneBanner.fulfilled, (state, action) => {
            state.loader = false;
            state.getOneBannerData = action.payload;
            state.message = action?.payload?.message;
            state.success = action?.payload?.success;
        })
        builder.addCase(removeBanner.pending, (state) => {
            state.loader = true
        })
        builder.addCase(removeBanner.fulfilled, (state, action) => {
            state.loader = false
            state.listOfCustomer = state?.getAllBannerData?.data?.filter((rows) => rows?.id !== action.payload.id)
            state.success = action.payload?.success
            state.message = action.payload?.message;
        })
        builder.addCase(removeBanner.rejected, (state, action) => {
            state.loader = false
            state.success = false
            state.message = action.payload?.message;
        })

    }
})

export const { resetMessage } = bannerReducer.actions;
export default bannerReducer.reducer;