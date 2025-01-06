import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import { useSelector } from "react-redux";
import {
  saveOrUpdateStory,
  setTitle,
  setCategory,
  loadStoryIdFromCookies,
  resetStory,
} from "@/lib/features/storySlice";
import Cookies from "js-cookie";
import type { RootState } from "@/lib/store";
import { useAppDispatch } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { fetchTopics } from "@/lib/features/topicSlice";

export default function PublishButton() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { title, category, content } = useSelector(
    (state: RootState) => state.story
  );

  const { topics, loading } = useSelector((state: RootState) => state.topic);

  useEffect(() => {
    dispatch(fetchTopics());
  }, [dispatch]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    dispatch(
      saveOrUpdateStory({
        title,
        category,
        id: null,
        content,
        articles: [],
        error: null,
        savedCollections: [],
        isLoading: false,
        article: null,
        coverImage: null,
      })
    ).then(() => {
      Cookies.remove("storyId");
      dispatch(loadStoryIdFromCookies());
      dispatch(resetStory());
      router.push("/profile");
      handleClose();
    });
  };

  return (
    <div>
      <Button
        variant="contained"
        color="success"
        className="text-sm py-2 px-4 rounded-md"
        onClick={handleOpen}
      >
        Publish
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Update Story Details</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={title}
            onChange={(e) => dispatch(setTitle(e.target.value))}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              value={category || ""}
              onChange={(e) => dispatch(setCategory(e.target.value))}
              label="Category"
            >
              {loading ? (
                <MenuItem disabled>
                  <CircularProgress size={24} />
                </MenuItem>
              ) : topics && topics.length > 0 ? (
                topics.map((topic) => (
                  <MenuItem key={topic} value={topic}>
                    {topic}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No topics available</MenuItem>
              )}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
