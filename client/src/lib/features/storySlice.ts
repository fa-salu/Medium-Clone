import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axios";
import Cookies from "js-cookie";
import type { RootState } from "../store";

interface StoryState {
  title: string;
  content: string;
  category: string;
  id: string | null;
  isSaving: boolean;
}

const initialState: StoryState = {
  title: "",
  content: "",
  category: "",
  id: null,
  isSaving: false,
};

export const fetchStory = createAsyncThunk(
  "story/fetchStory",
  async (storyId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/stories/${storyId}`);
      return response.data.data; // Assuming the story data is in response.data.data
    } catch (error) {
      return rejectWithValue("Failed to fetch story");
    }
  }
);

export const saveOrUpdateStory = createAsyncThunk(
  "story/saveOrUpdate",
  async (
    story: Omit<StoryState, "isSaving">,
    { rejectWithValue, getState }
  ) => {
    console.log("sss", story);
    try {
      const { id: existingId } = (getState() as RootState).story;
      const storyIdFromCookies = Cookies.get("storyId");

      const storyId = existingId || storyIdFromCookies || story.id;

      // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
      let response;

      if (storyId) {
        console.log("Updating story:", story);
        response = await axiosInstance.put(`/api/stories/${storyId}`, story);
      } else {
        console.log("Creating new story:", story);
        response = await axiosInstance.post("/api/stories", story);

        if (response.data.data._id && !storyId) {
          Cookies.set("storyId", response.data.data._id);
        }
      }

      return response.data.data;
    } catch (error) {
      return rejectWithValue("Failed to save or update story");
    }
  }
);

const storySlice = createSlice({
  name: "story",
  initialState,
  reducers: {
    setTitle(state, action: PayloadAction<string>) {
      state.title = action.payload;
    },
    setContent(state, action: PayloadAction<string>) {
      state.content = action.payload;
    },
    setCategory(state, action: PayloadAction<string>) {
      state.category = action.payload;
    },
    loadStoryIdFromCookies(state) {
      const storyId = Cookies.get("storyId");
      if (storyId && !state.id) {
        state.id = storyId;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStory.fulfilled, (state, action) => {
        const { title, content } = action.payload;
        state.title = title;
        state.content = content;
      })
      .addCase(saveOrUpdateStory.pending, (state) => {
        state.isSaving = true;
      })
      .addCase(saveOrUpdateStory.fulfilled, (state, action) => {
        state.id = action.payload?._id;
        state.isSaving = false;
      })
      .addCase(saveOrUpdateStory.rejected, (state) => {
        state.isSaving = false;
      });
  },
});

export const { setTitle, setContent, setCategory, loadStoryIdFromCookies } =
  storySlice.actions;
export default storySlice.reducer;
