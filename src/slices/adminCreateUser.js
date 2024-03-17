import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiCreateUser } from "../apis/userManagementAPI";

export const adminCreateUser = createAsyncThunk(
  "adminCreateUser",
  async (value) => {
    try {
      const data = await apiCreateUser(value);
      return data;
    } catch (error) {
      throw error.response?.data?.content;
    }
  }
);

const initialState = {
  user: null,
  isLoading: false,
  error: null,
};

const adminCreateUserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(adminCreateUser.pending, (state) => {
      return { ...state, isLoading: true, error: null };
    });
    builder.addCase(adminCreateUser.fulfilled, (state, action) => {
      return { ...state, isLoading: false, user: action.payload, error: null };
    });
    builder.addCase(adminCreateUser.rejected, (state, action) => {
      return { ...state, isLoading: false, error: action.error.message };
    });
  },
});

export default adminCreateUserSlice.reducer;
