import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiGetUserListPage } from "../apis/userManagementAPI";

export const getUserListPage = createAsyncThunk(
  "userListPage",
  async (value) => {
    try {
      const data = await apiGetUserListPage(value);
      return data.content;
    } catch (error) {
      throw error.response?.data?.content;
    }
  }
);

const initialState = {
  users: [],
  isLoading: false,
  error: null,
};

const userListPageSlice = createSlice({
  name: "userListPage",
  initialState,
  reducers: {
    userUpdate: (state, action) => {},
  },
  extraReducers: (builder) => {
    builder.addCase(getUserListPage.pending, (state) => {
      return { ...state, isLoading: true, error: null };
    });
    builder.addCase(getUserListPage.fulfilled, (state, action) => {
      return { ...state, isLoading: false, users: action.payload, error: null };
    });
    builder.addCase(getUserListPage.rejected, (state, action) => {
      return { ...state, isLoading: false, error: action.error.message };
    });
  },
});

export default userListPageSlice.reducer;
