import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/user";
import newMeetingReducer from "./slices/newMeeting";
import meetingDetailsReducer from "./slices/meetingDetails";




const store = configureStore({
  reducer: {
    user: userReducer,
    newMeeting: newMeetingReducer,
    meetingDetails: meetingDetailsReducer,
  },
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch