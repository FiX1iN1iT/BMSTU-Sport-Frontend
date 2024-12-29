import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api';
import { Section } from '../api/Api';

interface SectionState {
    data: Section | null;
    newSectionId: number | null;
    loading: boolean;
    error: boolean;
}

const initialState: SectionState = {
    data: null,
    newSectionId: null,
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

export const updateSection = createAsyncThunk(
    'section/updateSection',
    async ({ sectionId, updatedSection }: { sectionId: string; updatedSection: Section }, { rejectWithValue }) => {
        try {
            const response = await api.sections.sectionsChangeUpdate(sectionId, { ...updatedSection });
            return response.data
        } catch {
            return rejectWithValue('Не удалось обновить секцию')
        }
    }
);

export const updateSectionImage = createAsyncThunk(
    'section/updateSectionImage',
    async ({ sectionId, imageFile }: { sectionId: string; imageFile: File }, { rejectWithValue }) => {
        try {
            const response = await api.sections.sectionsUploadImageCreate(sectionId, { image: imageFile });
            return response.data
        } catch {
            return rejectWithValue('Не удалось обновить изображение секции')
        }
    }
);

export const createSection = createAsyncThunk(
    'section/createSection',
    async (newSection: Section, { rejectWithValue }) => {
        try {
            const response = await api.sections.sectionsCreate(newSection);
            return response.data
        } catch {
            return rejectWithValue('Не удалось создать секцию')
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

            .addCase(updateSection.fulfilled, (state, action) => {
                state.data = action.payload;
                state.error = false
            })
            .addCase(updateSection.rejected, (state) => {
                state.error = true
            })

            .addCase(updateSectionImage.fulfilled, (state) => {
                state.error = false
            })
            .addCase(updateSectionImage.rejected, (state) => {
                state.error = true
            })

            .addCase(createSection.fulfilled, (state, action) => {
                const data = action.payload;
                state.newSectionId = Number(data.pk);
                state.error = false
            })
            .addCase(createSection.rejected, (state) => {
                state.error = true
            })
    }
});

export default sectionSlice.reducer;
