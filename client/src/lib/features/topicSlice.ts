import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axios";
import { axiosErrorCatch } from "@/utils/axios-ErrorCatch";

interface TopicsState {
  topics: string[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: TopicsState = {
  topics: null,
  loading: false,
  error: null,
};

export const fetchTopics = createAsyncThunk<
  string[],
  void,
  { rejectValue: string }
>("topics/fetchTopics", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get("/api/topics");
    return response.data.data;
  } catch (error) {
    return rejectWithValue(axiosErrorCatch(error));
  }
});

export const createOrUpdateTopics = createAsyncThunk<
  string[],
  string[],
  { rejectValue: string }
>("topics/createOrUpdateTopics", async (topics, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/api/topics", { topics });
    return response.data.data;
  } catch (error) {
    return rejectWithValue(axiosErrorCatch(error));
  }
});

const topicsSlice = createSlice({
  name: "topics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTopics.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTopics.fulfilled, (state, action) => {
      state.loading = false;
      state.topics = action.payload;
    });
    builder.addCase(fetchTopics.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(createOrUpdateTopics.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createOrUpdateTopics.fulfilled, (state, action) => {
      state.loading = false;
      state.topics = action.payload;
    });
    builder.addCase(createOrUpdateTopics.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default topicsSlice.reducer;
