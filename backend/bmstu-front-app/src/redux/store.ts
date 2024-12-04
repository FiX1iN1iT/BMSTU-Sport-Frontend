import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './searchSlice.ts'; // Импортируем редюсер из searchSlice
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    search: searchReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
