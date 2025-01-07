import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axios";
import { axiosErrorCatch } from "@/utils/axios-ErrorCatch";

interface UserProfileState {
  name: string;
  imageUri: string;
  bio: string;
  loading: boolean;
  error: string | null;
}

const initialState: UserProfileState = {
  name: "",
  imageUri: "",
  bio: "",
  loading: false,
  error: null,
};

export const updateUserDetails = createAsyncThunk(
  "user/updateDetails",
  async (
    userDetails: { name?: string; imageUri?: string; bio?: string },
    thunkAPI
  ) => {
    try {
      const response = await axiosInstance.put(
        "/api/me/account/update",
        userDetails
      );
      return response.data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(axiosErrorCatch(error));
    }
  }
);

const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.name = action.payload.name;
        state.imageUri = action.payload.imageUri;
        state.bio = action.payload.bio;
      })
      .addCase(updateUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default userProfileSlice.reducer;
