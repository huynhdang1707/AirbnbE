import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiUpdateRoom } from "../apis/roomManagementAPI";

export const updateRoom = createAsyncThunk("updateRoom", async (value) => {
  try {
    const data = await apiUpdateRoom(value);
    return data;
  } catch (error) {
    throw error.response?.data?.content;
  }
});

const initialState = {
  room: [],
  isLoading: false,
  error: null,
  updated: false,
};

const updateRoomSlice = createSlice({
  name: "updateRoom",
  initialState,
  reducers: {
    roomUpdated: (state, action) => {
      return {
        ...state,
        room: action?.payload?.meta?.arg,
        updated: action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateRoom.pending, (state) => {
      return { ...state, isLoading: true, error: null, updated: false };
    });
    builder.addCase(updateRoom.fulfilled, (state, action) => {
      return {
        ...state,
        isLoading: false,
        room: action.payload,
        error: null,
        updated: true,
      };
    });
    builder.addCase(updateRoom.rejected, (state, action) => {
      return {
        ...state,
        isLoading: false,
        error: action.error.message,
        updated: false,
      };
    });
  },
});

export const { roomUpdated } = updateRoomSlice.actions;

export default updateRoomSlice.reducer;
