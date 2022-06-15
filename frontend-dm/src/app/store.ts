import { configureStore } from "@reduxjs/toolkit";
import arrayWordsReducer from "../features/arrayWordsSlice";
import editModeReducer from "../features/editModeSlice";
import searchReducer from "../features/searchSlice";
import projectItemReducer from "../features/projectItemSlice";
import settingsReducer from "../features/settingsSlice";
import authReducer from "../features/authSlice";
export const store = configureStore({
  reducer: {
    arrayWords: arrayWordsReducer,
    editMode: editModeReducer,
    search: searchReducer,
    projectItem: projectItemReducer,
    settings: settingsReducer,
    auth: authReducer
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
