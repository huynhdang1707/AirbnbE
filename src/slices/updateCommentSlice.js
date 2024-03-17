import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiUpdateComment } from "../apis/commentManagementAPI";

export const updateComment = createAsyncThunk(
  "updateComment",
  async (value) => {
    try {
      const data = await apiUpdateComment(value);
      return data;
    } catch (error) {
      throw error.response?.data?.content;
    }
  }
);
const initialState = {
  comment: [],
  isLoading: false,
  error: null,
  updated: false,
};
const updateCommentSlice = createSlice({
  name: "updateComment",
  initialState,
  reducers: {
    commentUpdated: (state, action) => {
      return {
        ...state,
        comment: action?.payload?.meta?.arg,
        updated: action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateComment.pending, (state) => {
      return { ...state, isLoading: true, error: null, updated: false };
    });
    builder.addCase(updateComment.fulfilled, (state, action) => {
      return {
        ...state,
        isLoading: false,
        comment: action.payload,
        error: null,
        updated: true,
      };
    });
    builder.addCase(updateComment.rejected, (state, action) => {
      return {
        ...state,
        isLoading: false,
        error: action.error.message,
        updated: false,
      };
    });
  },
});
export const { commentUpdated } = updateCommentSlice.actions;

export default updateCommentSlice.reducer;
