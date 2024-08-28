import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/slice';
import entriesReducer from '../features/entries/slice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    entries: entriesReducer
  }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
