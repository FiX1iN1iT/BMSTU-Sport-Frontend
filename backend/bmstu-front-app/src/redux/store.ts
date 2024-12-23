import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import searchReducer from './searchSlice.ts';
import authReducer from './authSlice';
import sectionsReducer from './sectionsSlice.ts'
import sectionReducer from './sectionSlice.ts'
import applicationReducer from './applicationSlice.ts'
import applicationsReducer from './applicationsSlice.ts'

export const store = configureStore({
    reducer: {
        search: searchReducer,
        auth: authReducer,
        sections: sectionsReducer,
        section: sectionReducer,
        application: applicationReducer,
        applications: applicationsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
