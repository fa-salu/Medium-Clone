import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/lib/features/authSlice";
import uploadReducer from "@/lib/features/uploadSlice";
import storyReducer from "@/lib/features/storySlice";
import topicReducer from "@/lib/features/topicSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userReducer,
      upload: uploadReducer,
      story: storyReducer,
      topic: topicReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
