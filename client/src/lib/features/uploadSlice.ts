import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axios";
import { axiosErrorCatch } from "@/utils/axios-ErrorCatch";

export const uploadImage = createAsyncThunk(
  "upload/uploadImage",
  async (file: File, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axiosInstance.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.url;
    } catch (error) {
      return rejectWithValue(axiosErrorCatch(error));
    }
  }
);

interface UploadState {
  url: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UploadState = {
  url: null,
  isLoading: false,
  error: null,
};

const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    resetImage: (state) => {
      state.url = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadImage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.url = action.payload;
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetImage } = uploadSlice.actions;
export default uploadSlice.reducer;
