import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axios";
import Cookies from "js-cookie";
import type { RootState } from "../store";

interface AuthorDetails {
  email: string;
  imageUri: string;
  name: string;
}

interface Article {
  _id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  claps: number;
  likes: number;
  authorDetails: AuthorDetails;
  imageUri: string;
}

interface StoryState {
  title: string;
  content: string;
  category: string;
  id: string | null;
  isSaving: boolean;
  articles: Article[];
}

const initialState: StoryState = {
  title: "",
  content: "",
  category: "",
  id: null,
  isSaving: false,
  articles: [],
};

export const fetchStory = createAsyncThunk(
  "story/fetchStory",
  async (storyId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/stories/${storyId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch story");
    }
  }
);

export const fetchAllStories = createAsyncThunk(
  "story/fetchAllStories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/stories");
      return response.data.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch stories");
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
    resetStory(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStory.fulfilled, (state, action) => {
        const { title, content } = action.payload;
        state.title = title;
        state.content = content;
      })
      .addCase(fetchAllStories.fulfilled, (state, action) => {
        state.articles = action.payload || []; // Populate articles
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

export const {
  setTitle,
  setContent,
  setCategory,
  loadStoryIdFromCookies,
  resetStory,
} = storySlice.actions;
export default storySlice.reducer;
