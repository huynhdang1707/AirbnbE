import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiGetInfoUser } from "../apis/userAPI";

export const getInfoUser = createAsyncThunk("user/infoUser", async (value) => {
  try {
    const data = await apiGetInfoUser(value);
    return data.content;
  } catch (error) {
    throw error.response?.data?.content;
  }
});

const initialState = {
  infoUser: [],
  isLoading: false,
  error: null,
};

const infoUserSlice = createSlice({
  name: "infoUser",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getInfoUser.pending, (state) => {
      return { ...state, isLoading: true, error: null };
    });
    builder.addCase(getInfoUser.fulfilled, (state, action) => {
      return {
        ...state,
        isLoading: false,
        infoUser: action.payload,
        error: null,
      };
    });
    builder.addCase(getInfoUser.rejected, (state, action) => {
      return { ...state, isLoading: false, error: action.error.message };
    });
  },
});

export default infoUserSlice.reducer;
