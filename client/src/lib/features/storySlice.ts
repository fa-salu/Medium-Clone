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
  error: string | null; // Add an error property to store error messages
}

const initialState: StoryState = {
  title: "",
  content: "",
  category: "",
  id: null,
  isSaving: false,
  articles: [],
  error: null, // Initialize error as null
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
  async (category: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/api/stories?category=${category}`
      );
      if (response.status === 404) {
        return rejectWithValue("No articles available in this category");
      }
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
    try {
      const { id: existingId } = (getState() as RootState).story;
      const storyIdFromCookies = Cookies.get("storyId");

      const storyId = existingId || storyIdFromCookies || story.id;

      // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
      let response;

      if (storyId) {
        response = await axiosInstance.put(`/api/stories/${storyId}`, story);
      } else {
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
        state.articles = action.payload || [];
        state.error = null; // Reset any previous errors
      })
      .addCase(fetchAllStories.rejected, (state, action) => {
        state.error = action.payload as string; // Set error state when the API call fails
        state.articles = []; // Optionally reset articles to empty if there is an error
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
