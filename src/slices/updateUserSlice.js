import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiUpdateUser } from "../apis/userManagementAPI";

export const updateUser = createAsyncThunk("updateUser", async (value) => {
  try {
    const data = await apiUpdateUser(value);
    return data;
  } catch (error) {
    throw error.response?.data?.content;
  }
});

const initialState = {
  user: [],
  isLoading: false,
  error: null,
  updated: false,
};

const updateUserSlice = createSlice({
  name: "updateUser",
  initialState,
  reducers: {
    userUpdated: (state, action) => {
      return {
        ...state,
        user: action?.payload?.meta?.arg,
        updated: action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateUser.pending, (state) => {
      return { ...state, isLoading: true, error: null, updated: false };
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      return {
        ...state,
        isLoading: false,
        user: action.payload,
        error: null,
        updated: true,
      };
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      return {
        ...state,
        isLoading: false,
        error: action.error.message,
        updated: false,
      };
    });
  },
});

export const { userUpdated } = updateUserSlice.actions;

export default updateUserSlice.reducer;
