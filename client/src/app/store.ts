import { configureStore } from '@reduxjs/toolkit';
import fileReducer from '../features/documents/fileSlice.ts';

export const store = configureStore({
    reducer: {
        files: fileReducer,
    },
});

// These types help TypeScript understand your store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;