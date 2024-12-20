import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

interface UserState {
  user: {
    name: string;
    email: string;
    imageUri: string;
  } | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UserState = {
  user: null,
  status: "idle",
  error: null,
};

export const handleGoogleLogin = createAsyncThunk(
  "user/login",
  async (userDetails: { name: string; email: string; imageUri: string }) => {
    const response = await axios.post(
      "http://localhost:3001/api/auth/login",
      userDetails
    );

    const { token, user } = response.data.data;

    Cookies.set("user", token, {
      expires: 7,
      secure: true,
      sameSite: "strict",
    });

    return user;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.status = "idle";
      state.error = null;
      Cookies.remove("authToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(handleGoogleLogin.pending, (state) => {
        state.status = "loading";
      })
      .addCase(handleGoogleLogin.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(handleGoogleLogin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to login";
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
