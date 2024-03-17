import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiGetDescListPage } from "../apis/descManagementAPI";

export const getDescListPage = createAsyncThunk(
  "descListPage",
  async (value) => {
    try {
      const data = await apiGetDescListPage(value);
      return data.content;
    } catch (error) {
      throw error.response?.data?.content;
    }
  }
);

const initialState = {
  descs: [],
  isLoading: false,
  error: null,
};

const descListPageSlice = createSlice({
  name: "descListPage",
  initialState,
  reducers: {
    descUpdate: (state, action) => {},
  },
  extraReducers: (builder) => {
    builder.addCase(getDescListPage.pending, (state) => {
      return { ...state, isLoading: true, error: null };
    });
    builder.addCase(getDescListPage.fulfilled, (state, action) => {
      return { ...state, isLoading: false, descs: action.payload, error: null };
    });
    builder.addCase(getDescListPage.rejected, (state, action) => {
      return { ...state, isLoading: false, error: action.error.message };
    });
  },
});

export default descListPageSlice.reducer;
