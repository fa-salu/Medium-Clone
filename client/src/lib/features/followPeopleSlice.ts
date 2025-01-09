import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axios";
import { axiosErrorCatch } from "@/utils/axios-ErrorCatch";
import type { AuthorDetails } from "@/lib/features/storySlice";

interface FollowerData {
  _id: string;
  follower: AuthorDetails;
  following: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface FollowingData {
  _id: string;
  follower: string;
  following: AuthorDetails;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface FollowResponse<T> {
  statusCode: number;
  status: string;
  message: string;
  data: T[];
}

interface FollowState {
  followers: FollowerData[];
  following: FollowingData[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

export const followUser = createAsyncThunk<
  FollowResponse<FollowerData>,
  string
>("follow/followUser", async (followId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/api/follow", { followId });
    return response.data;
  } catch (error) {
    return rejectWithValue(axiosErrorCatch(error));
  }
});

export const getFollowers = createAsyncThunk<
  FollowResponse<FollowerData>,
  string
>("follow/getFollowers", async (userId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/api/${userId}/followers`);
    return response.data;
  } catch (error) {
    return rejectWithValue(axiosErrorCatch(error));
  }
});

export const getFollowing = createAsyncThunk<
  FollowResponse<FollowingData>,
  string
>("follow/getFollowing", async (userId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/api/${userId}/following`);
    return response.data;
  } catch (error) {
    return rejectWithValue(axiosErrorCatch(error));
  }
});

const followSlice = createSlice({
  name: "follow",
  initialState: {
    followers: [] as FollowerData[],
    following: [] as FollowingData[],
    loading: false,
    error: null as string | null,
    successMessage: null,
  } as FollowState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(followUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(followUser.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "User followed successfully!";
      })
      .addCase(followUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(getFollowers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFollowers.fulfilled, (state, action) => {
        state.loading = false;
        state.followers = action.payload.data;
      })
      .addCase(getFollowers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(getFollowing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFollowing.fulfilled, (state, action) => {
        state.loading = false;
        state.following = action.payload.data;
      })
      .addCase(getFollowing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default followSlice.reducer;
