import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiGetRoomListPage } from "../apis/roomManagementAPI";

export const getRoomListPage = createAsyncThunk(
  "roomListPage",
  async (value) => {
    try {
      const data = await apiGetRoomListPage(value);
      return data.content;
    } catch (error) {
      throw error.response?.data?.content;
    }
  }
);

const initialState = {
  rooms: [],
  isLoading: false,
  error: null,
};

const roomListPageSlice = createSlice({
  name: "roomListPage",
  initialState,
  reducers: {
    roomUpdate: (state, action) => {},
  },
  extraReducers: (builder) => {
    builder.addCase(getRoomListPage.pending, (state) => {
      return { ...state, isLoading: true, error: null };
    });
    builder.addCase(getRoomListPage.fulfilled, (state, action) => {
      return { ...state, isLoading: false, rooms: action.payload, error: null };
    });
    builder.addCase(getRoomListPage.rejected, (state, action) => {
      return { ...state, isLoading: false, error: action.error.message };
    });
  },
});

export default roomListPageSlice.reducer;
