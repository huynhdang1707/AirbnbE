import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiCreateRoom } from "../apis/roomManagementAPI";

export const adminCreateRoom = createAsyncThunk(
  "adminCreateRoom",
  async (value) => {
    try {
      const data = await apiCreateRoom(value);
      return data;
    } catch (error) {
      throw error.response?.data?.content;
    }
  }
);

const initialState = {
  room: null,
  isLoading: false,
  error: null,
};

const adminCreateRoomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(adminCreateRoom.pending, (state) => {
      return { ...state, isLoading: true, error: null };
    });
    builder.addCase(adminCreateRoom.fulfilled, (state, action) => {
      return { ...state, isLoading: false, room: action.payload, error: null };
    });
    builder.addCase(adminCreateRoom.rejected, (state, action) => {
      return { ...state, isLoading: false, error: action.error.message };
    });
  },
});

export default adminCreateRoomSlice.reducer;
