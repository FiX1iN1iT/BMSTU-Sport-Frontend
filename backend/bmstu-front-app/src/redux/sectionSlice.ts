import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api';
import { Section } from '../api/Api';

interface SectionState {
    data: Section | null;
    loading: boolean;
    error: boolean;
}

const initialState: SectionState = {
    data: null,
    loading: true,
    error: false
};

export const fetchSection = createAsyncThunk(
    'section/fetchSection',
    async (sectionId: string, { rejectWithValue }) => {
        try {
            const response = await api.sections.sectionsRead(sectionId);
            return response.data
        } catch {
            return rejectWithValue('Не удалось получить секцию по id')
        }
    }
);

const sectionSlice = createSlice({
    name: 'section',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSection.pending, (state) => {
                state.loading = true
                state.error = false
            })
            .addCase(fetchSection.fulfilled, (state, action) => {
                state.data = action.payload;

                state.error = false
                state.loading = false
            })
            .addCase(fetchSection.rejected, (state) => {
                state.error = true
                state.loading = false
            })
    }
});

export default sectionSlice.reducer;
