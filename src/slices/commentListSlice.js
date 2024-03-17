import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiGetCommentList } from "../apis/commentManagementAPI";

export const getCommentList = createAsyncThunk("commentList", async () => {
  try {
    const data = await apiGetCommentList();
    return data.content;
  } catch (error) {
    throw error.response?.data?.content;
  }
});
const initialState = {
  comments: [],
  isLoading: false,
  error: null,
};
const commentListSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    descUpdate: (state, action) => {},
  },
  extraReducers: (builder) => {
    builder.addCase(getCommentList.pending, (state) => {
      return { ...state, isLoading: true, error: null };
    });
    builder.addCase(getCommentList.fulfilled, (state, action) => {
      return {
        ...state,
        isLoading: false,
        comments: action.payload,
        error: null,
      };
    });
    builder.addCase(getCommentList.rejected, (state, action) => {
      return { ...state, isLoading: false, error: action.error.message };
    });
  },
});
export default commentListSlice.reducer;
