import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import searchReducer from './searchSlice.ts';
import authReducer from './authSlice';
import sectionsReducer from './sectionsSlice.ts'

export const store = configureStore({
    reducer: {
        search: searchReducer,
        auth: authReducer,
        sections: sectionsReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
