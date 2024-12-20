import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Create an async thunk to handle file upload
export const uploadImage = createAsyncThunk(
  "upload/uploadImage",
  async (file: File, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        "http://localhost:3001/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("response:", response.data);

      return response.data.url; // Return the uploaded image URL
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    } catch (error: any) {
      return rejectWithValue(error.response.data); // Handle errors
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
  reducers: {},
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

export default uploadSlice.reducer;
