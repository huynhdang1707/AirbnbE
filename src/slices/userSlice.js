import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiSignIn } from "../apis/userAPI";

//create thunk
export const signin = createAsyncThunk("user/signin", async (value) => {
  try {
    const data = await apiSignIn(value);
    localStorage.setItem("user", JSON.stringify(data.content));
    return data.content;
  } catch (error) {
    throw error.response?.data?.content;
  }
});

//reducer
const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signout: (state, action) => {
      return { ...state, user: null };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signin.pending, (state) => {
      return { ...state, isLoading: true, error: null };
    });
    builder.addCase(signin.fulfilled, (state, action) => {
      return { ...state, isLoading: false, user: action.payload, error: null };
    });
    builder.addCase(signin.rejected, (state, action) => {
      return { ...state, isLoading: false, error: action.error.message };
    });
  },
});

export const { signout } = userSlice.actions;
export default userSlice.reducer;
