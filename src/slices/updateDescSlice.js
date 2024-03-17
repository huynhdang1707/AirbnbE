import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiUpdateDesc } from "../apis/descManagementAPI";

export const updateDesc = createAsyncThunk("updateDesc", async (value) => {
  try {
    const data = await apiUpdateDesc(value);
    return data;
  } catch (error) {
    throw error.response?.data?.content;
  }
});

const initialState = {
  desc: [],
  isLoading: false,
  error: null,
  updated: false,
};

const updateDescSlice = createSlice({
  name: "updateDesc",
  initialState,
  reducers: {
    descUpdated: (state, action) => {
      return {
        ...state,
        desc: action?.payload?.meta?.arg,
        updated: action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateDesc.pending, (state) => {
      return { ...state, isLoading: true, error: null, updated: false };
    });
    builder.addCase(updateDesc.fulfilled, (state, action) => {
      return {
        ...state,
        isLoading: false,
        desc: action.payload,
        error: null,
        updated: true,
      };
    });
    builder.addCase(updateDesc.rejected, (state, action) => {
      return {
        ...state,
        isLoading: false,
        error: action.error.message,
        updated: false,
      };
    });
  },
});

export const { descUpdated } = updateDescSlice.actions;

export default updateDescSlice.reducer;
