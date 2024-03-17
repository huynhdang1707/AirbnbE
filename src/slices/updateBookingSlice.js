import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiUpdateBooking } from "../apis/bookingManagementAPI";

export const updateBooking = createAsyncThunk(
  "updateBooking",
  async (value) => {
    try {
      const data = await apiUpdateBooking(value);
      return data;
    } catch (error) {
      throw error.response?.data?.content;
    }
  }
);

const initialState = {
  booking: [],
  isLoading: false,
  error: null,
  updated: false,
};

const updateBookingSlice = createSlice({
  name: "updateBooking",
  initialState,
  reducers: {
    bookingUpdated: (state, action) => {
      return {
        ...state,
        booking: action?.payload?.meta?.arg,
        updated: action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateBooking.pending, (state) => {
      return { ...state, isLoading: true, error: null, updated: false };
    });
    builder.addCase(updateBooking.fulfilled, (state, action) => {
      return {
        ...state,
        isLoading: false,
        booking: action.payload,
        error: null,
        updated: true,
      };
    });
    builder.addCase(updateBooking.rejected, (state, action) => {
      return {
        ...state,
        isLoading: false,
        error: action.error.message,
        updated: false,
      };
    });
  },
});
export const { bookingUpdated } = updateBookingSlice.actions;

export default updateBookingSlice.reducer;
