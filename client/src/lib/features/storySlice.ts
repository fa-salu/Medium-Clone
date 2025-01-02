import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axios";
import Cookies from "js-cookie";
import type { RootState } from "../store";

interface AuthorDetails {
  _id: string;
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

interface SavedCollection {
  _id: string;
  collectionName: string;
  stories: Article[];
  userDetails?: AuthorDetails[];
}

interface StoryState {
  title: string;
  content: string;
  category: string;
  id: string | null;
  isSaving: boolean;
  isLoading: boolean;
  article: Article | null;
  articles: Article[];
  savedCollections: SavedCollection[];
  error: string | null;
}

const initialState: StoryState = {
  title: "",
  content: "",
  category: "",
  id: null,
  isSaving: false,
  isLoading: false,
  article: null,
  articles: [],
  savedCollections: [],
  error: null,
};

export const fetchStory = createAsyncThunk(
  "story/fetchStory",
  async (storyId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/stories/${storyId}`);
      console.log("fetchSotry:", response.data.data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch story");
    }
  }
);

export const fetchStoryByListName = createAsyncThunk(
  "story/fetchStoryByListName",
  async (listName: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/api/saved-collections/${listName}`
      );
      console.log("fetchStoryByListName:", response.data.data);
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

export const addClaps = createAsyncThunk(
  "story/addClaps",
  async ({ storyId }: { storyId: string }, { rejectWithValue }) => {
    console.log("clap");
    try {
      const response = await axiosInstance.post(
        `/api/stories/${storyId}/claps`
      );
      console.log("clap res:", response.data.data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue("Failed to update claps");
    }
  }
);

export const saveStoryToCollection = createAsyncThunk(
  "story/saveToCollection",
  async (
    { storyId, collectionName }: { storyId: string; collectionName: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post("/api/save-story", {
        storyId,
        collectionName,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue("Failed to save story to collection");
    }
  }
);

export const fetchSavedCollections = createAsyncThunk(
  "story/fetchSavedCollections",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/save-collection");
      return response.data.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch saved collections");
    }
  }
);

export const fetchStoryByAuthor = createAsyncThunk(
  "story/fetchStoryByAuthor",
  async ({ authorId }: { authorId: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/api/stories/author/${authorId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch story by author");
    }
  }
);

export const deleteStory = createAsyncThunk(
  "story/deleteStory",
  async ({ storyId }: { storyId: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/api/stories/${storyId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to delete story");
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
      .addCase(fetchStoryByAuthor.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchStoryByAuthor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.articles = action.payload.stories;
      })
      .addCase(fetchStoryByAuthor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchStory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.article = action.payload;
        state.title = action.payload.title;
        state.content = action.payload.content;
      })
      .addCase(fetchStory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchStoryByListName.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStoryByListName.fulfilled, (state, action) => {
        state.isLoading = false;
        state.savedCollections = action.payload;
      })
      .addCase(fetchStoryByListName.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAllStories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllStories.fulfilled, (state, action) => {
        state.articles = action.payload || [];
        state.error = null;
      })
      .addCase(fetchAllStories.rejected, (state, action) => {
        state.error = action.payload as string;
        state.articles = [];
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
      })
      .addCase(addClaps.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addClaps.fulfilled, (state, action) => {
        const updatedStory = action.payload;
        if (state.article && state.article._id === updatedStory._id) {
          state.article.claps = updatedStory.claps;
        }
        const index = state.articles.findIndex(
          (story) => story._id === updatedStory._id
        );
        if (index !== -1) {
          state.articles[index].claps = updatedStory.claps;
        }
      })
      .addCase(addClaps.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(saveStoryToCollection.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(saveStoryToCollection.fulfilled, (state, action) => {
        const { storyId, collectionName } = action.payload;
        const collection = state.savedCollections.find(
          (c) => c.collectionName === collectionName
        );

        if (collection) {
          const storyExists = collection.stories.some(
            (story) => story?._id === storyId
          );
          if (storyExists) {
            collection.stories = collection.stories.filter(
              (story) => story?._id !== storyId
            );
          } else {
            collection.stories.push(action.payload.stories);
          }
        } else {
          state.savedCollections.push({
            collectionName,
            stories: [action.payload.stories],
            _id: "",
          });
        }
      })
      .addCase(saveStoryToCollection.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchSavedCollections.fulfilled, (state, action) => {
        state.savedCollections = action.payload;
        state.error = null;
      })
      .addCase(fetchSavedCollections.rejected, (state, action) => {
        state.error = action.payload as string;
        state.savedCollections = [];
      })
      .addCase(deleteStory.fulfilled, (state, action) => {
        state.articles = state.articles.filter(
          (article) => article._id !== action.payload?.storyId
        );
      })
      .addCase(deleteStory.rejected, (state, action) => {
        state.error = action.payload as string;
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
