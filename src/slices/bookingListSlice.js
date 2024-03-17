import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiGetBookingList } from "../apis/bookingManagementAPI";

export const getBookingList = createAsyncThunk("bookingList", async () => {
  try {
    const data = await apiGetBookingList();
    return data.content;
  } catch (error) {
    throw error.response?.data?.content;
  }
});

const initialState = {
  bookings: [],
  isLoading: false,
  error: null,
};

const bookingListSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    descUpdate: (state, action) => {},
  },
  extraReducers: (builder) => {
    builder.addCase(getBookingList.pending, (state) => {
      return { ...state, isLoading: true, error: null };
    });
    builder.addCase(getBookingList.fulfilled, (state, action) => {
      return {
        ...state,
        isLoading: false,
        bookings: action.payload,
        error: null,
      };
    });
    builder.addCase(getBookingList.rejected, (state, action) => {
      return { ...state, isLoading: false, error: action.error.message };
    });
  },
});
export default bookingListSlice.reducer;
