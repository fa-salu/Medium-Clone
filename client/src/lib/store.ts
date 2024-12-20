import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/lib/features/authSlice";
import uploadReducer from "@/lib/features/uploadSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userReducer,
      upload: uploadReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
