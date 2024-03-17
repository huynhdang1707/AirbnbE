import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiCreateBooking } from "../apis/bookingManagementAPI";

export const userCreateBooking = createAsyncThunk(
  "userCreateBooking",
  async (value) => {
    try {
      const data = await apiCreateBooking(value);
      return data;
    } catch (error) {
      throw error.response?.data?.content;
    }
  }
);

const initialState = {
  booking: null,
  isLoading: false,
  error: null,
};

const userCreateBookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    createBooking: (state, action) => {
      return { ...state, booking: action?.payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(userCreateBooking.pending, (state) => {
      return { ...state, isLoading: true, error: null };
    });
    builder.addCase(userCreateBooking.fulfilled, (state, action) => {
      return {
        ...state,
        isLoading: false,
        booking: action.payload,
        error: null,
      };
    });
    builder.addCase(userCreateBooking.rejected, (state, action) => {
      return { ...state, isLoading: false, error: action.error.message };
    });
  },
});

export const { createBooking } = userCreateBookingSlice.actions;

export default userCreateBookingSlice.reducer;
