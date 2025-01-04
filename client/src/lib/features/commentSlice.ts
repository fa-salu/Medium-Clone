import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axios";
import { axiosErrorCatch } from "@/utils/axios-ErrorCatch";

export interface Comment {
  _id: string;
  content: string;
  parentComment: string;
  author: {
    _id: string;
    name: string;
    email: string;
    imageUri: string;
    likedPosts: string[];
    clappedPosts: string[];
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
}

interface CommentsState {
  comments: Comment[];
  replies: Comment[];
  loading: boolean;
  error: string | null;
}

const initialState: CommentsState = {
  comments: [],
  replies: [],
  loading: false,
  error: null,
};

export const fetchCommentsByStory = createAsyncThunk(
  "comments/fetchCommentsByStory",
  async (storyId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/comments/${storyId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(axiosErrorCatch(error));
    }
  }
);

export const fetchRepliesByComment = createAsyncThunk(
  "comments/fetchRepliesByComment",
  async (commentId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/api/comments/replays/${commentId}`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(axiosErrorCatch(error));
    }
  }
);

export const createComment = createAsyncThunk(
  "comments/createComment",
  async (
    { content, storyId }: { content: string; storyId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post("/api/comment", {
        content,
        storyId,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(axiosErrorCatch(error));
    }
  }
);

export const createReply = createAsyncThunk(
  "comments/createReply",
  async (
    {
      content,
      storyId,
      parentCommentId,
    }: { content: string; storyId: string; parentCommentId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post("/api/comment/reply", {
        content,
        storyId,
        parentCommentId,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(axiosErrorCatch(error));
    }
  }
);

export const updateComment = createAsyncThunk(
  "comments/updateComment",
  async (
    { commentId, content }: { commentId: string; content: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put(`/comments/${commentId}`, {
        content,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(axiosErrorCatch(error));
    }
  }
);

export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async (commentId: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/comment/${commentId}`);
      return commentId;
    } catch (error) {
      return rejectWithValue(axiosErrorCatch(error));
    }
  }
);

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    clearReplies(state) {
      state.replies = [];
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchCommentsByStory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommentsByStory.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchCommentsByStory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchRepliesByComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRepliesByComment.fulfilled, (state, action) => {
        state.loading = false;
        state.replies = action.payload;
      })
      .addCase(fetchRepliesByComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments.push(action.payload);
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createReply.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReply.fulfilled, (state, action) => {
        state.loading = false;
        state.replies.push(action.payload);
      })
      .addCase(createReply.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.comments.findIndex(
          (comment) => comment._id === action.payload._id
        );
        if (index !== -1) {
          state.comments[index] = action.payload;
        }
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = state.comments.filter(
          (comment) => comment._id !== action.payload
        );
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearReplies } = commentsSlice.actions;

export default commentsSlice.reducer;
