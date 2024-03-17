import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiCreateComment } from "../apis/commentManagementAPI";

export const userCreateComment = createAsyncThunk(
  "userCreateComment",
  async (value) => {
    try {
      const data = await apiCreateComment(value);
      return data;
    } catch (error) {
      throw error.response?.data?.content;
    }
  }
);
const initialState = {
  comment: null,
  isLoading: false,
  error: null,
};
const userCreateCommentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    createComment: (state, action) => {
      return { ...state, comment: action?.payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(userCreateComment.pending, (state) => {
      return { ...state, isLoading: true, error: null };
    });
    builder.addCase(userCreateComment.fulfilled, (state, action) => {
      return {
        ...state,
        isLoading: false,
        comment: action.payload,
        error: null,
      };
    });
    builder.addCase(userCreateComment.rejected, (state, action) => {
      return { ...state, isLoading: false, error: action.error.message };
    });
  },
});

export const { createComment } = userCreateCommentSlice.actions;

export default userCreateCommentSlice.reducer;
