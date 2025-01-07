import axiosInstance from "@/utils/axios";
import { axiosErrorCatch } from "@/utils/axios-ErrorCatch";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface UserState {
  userDetails: {
    _id: string | null;
    name: string;
    email: string;
    bio?: string;
    imageUri: string;
  } | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UserState = {
  userDetails: null,
  status: "idle",
  error: null,
};

export const fetchUserById = createAsyncThunk(
  "user/fetchUserById",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/user/${userId}`);
      return response.data.data;
    } catch (error) {
      axiosErrorCatch(error);
      return rejectWithValue("Failed to fetch user by id");
    }
  }
);

const userSlice = createSlice({
  name: "userDetails",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Fetch user by id
      .addCase(fetchUserById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userDetails = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;
