import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/lib/features/authSlice";
import uploadReducer from "@/lib/features/uploadSlice";
import storyReducer from "@/lib/features/storySlice";
import topicReducer from "@/lib/features/topicSlice";
import commentReducer from "@/lib/features/commentSlice";
import topicFollowReducer from "@/lib/features/topicFollowSlice";
import userDetailsReducer from "@/lib/features/userSlice";
import followUser from "@/lib/features/followPeopleSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userReducer,
      userDetail: userDetailsReducer,
      upload: uploadReducer,
      story: storyReducer,
      topic: topicReducer,
      comment: commentReducer,
      topicFollow: topicFollowReducer,
      followUser: followUser,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
