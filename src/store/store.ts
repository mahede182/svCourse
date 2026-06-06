import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';
import courseReducer from './courseSlice';

export const store = configureStore({
  reducer: {
    course: courseReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
