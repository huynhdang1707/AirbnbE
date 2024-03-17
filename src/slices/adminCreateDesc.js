import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiCreateDesc } from "../apis/descManagementAPI";

export const adminCreateDesc = createAsyncThunk(
  "adminCreateDesc",
  async (value) => {
    try {
      const data = await apiCreateDesc(value);
      return data;
    } catch (error) {
      throw error.response?.data?.content;
    }
  }
);

const initialState = {
  desc: null,
  isLoading: false,
  error: null,
};

const adminCreateDescSlice = createSlice({
  name: "desc",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(adminCreateDesc.pending, (state) => {
      return { ...state, isLoading: true, error: null };
    });
    builder.addCase(adminCreateDesc.fulfilled, (state, action) => {
      return { ...state, isLoading: false, desc: action.payload, error: null };
    });
    builder.addCase(adminCreateDesc.rejected, (state, action) => {
      return { ...state, isLoading: false, error: action.error.message };
    });
  },
});

export default adminCreateDescSlice.reducer;
