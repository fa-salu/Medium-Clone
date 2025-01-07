import axiosInstance from "@/utils/axios";
import { axiosErrorCatch } from "@/utils/axios-ErrorCatch";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface UserState {
  user: {
    _id: string | null;
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

// Async thunk for Google login
export const handleGoogleLogin = createAsyncThunk(
  "user/login",
  async (userDetails: { name: string; email: string; imageUri: string }) => {
    const response = await axiosInstance.post("/api/auth/login", userDetails);

    const { token, user } = response.data.data;

    Cookies.set("user", token, {
      expires: 7,
      secure: true,
      sameSite: "strict",
    });

    return user;
  }
);

export const fetchUserDetails = createAsyncThunk(
  "user/fetchUserDetails",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/user");
      return response.data.data;
    } catch (error) {
      axiosErrorCatch(error);
      return rejectWithValue("Failed to fetch user details");
    }
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
      // Google login
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
      })

      // Fetch user details
      .addCase(fetchUserDetails.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
