import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axios";
import { axiosErrorCatch } from "@/utils/axios-ErrorCatch";

interface FollowTopics {
  _id: string;
  topics: string[];
  userId: string;
}

interface TopicsState {
  followTopics: FollowTopics | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: TopicsState = {
  followTopics: null,
  status: "idle",
  error: null,
};

export const fetchFollowedTopics = createAsyncThunk(
  "topics/fetchFollowedTopics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/follow-topics");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(axiosErrorCatch(error));
    }
  }
);

export const followTopic = createAsyncThunk(
  "topics/followTopic",
  async (topic: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/follow-topics", {
        topic,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(axiosErrorCatch(error));
    }
  }
);

const topicsSlice = createSlice({
  name: "topics",
  initialState,
  reducers: {
    resetError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFollowedTopics.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFollowedTopics.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.followTopics = action.payload;
      })
      .addCase(fetchFollowedTopics.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      .addCase(followTopic.pending, (state) => {
        state.status = "loading";
      })
      .addCase(followTopic.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.followTopics = action.payload;
      })
      .addCase(followTopic.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { resetError } = topicsSlice.actions;

export default topicsSlice.reducer;
