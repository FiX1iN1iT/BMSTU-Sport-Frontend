import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api';
import { Section } from '../api/Api';

interface SectionsStateData {
    sections: Section[];
    draftApplicationID: number;
    applicationSectionsCounter: number;
}

interface SectionsState {
    data: SectionsStateData;
    loading: boolean;
    error: boolean;
}

const initialState: SectionsState = {
    data: { sections: [], draftApplicationID: 0, applicationSectionsCounter: 0 },
    loading: true,
    error: false
};

export const fetchSections = createAsyncThunk(
    'sections/fetchSections',
    async (searchValue: string | undefined, { rejectWithValue }) => {
        try {
            const response = await api.sections.sectionsList({ section_title: searchValue });
            return response.data
        } catch {
            return rejectWithValue('Не удалось получить список секций')
        }
    }
);

export const addSectionToDraft = createAsyncThunk(
    'sections/addSectionToDraft',
    async (sectionId: number, { rejectWithValue }) => {
        try {
            const response = await api.applications.applicationsDraftCreate({section_id: sectionId});
            return response.data
        } catch {
            return rejectWithValue('Не удалось добавить секцию к заявке-черновику')
        }
    }
);

export const createSection = createAsyncThunk(
    'sections/createSection',
    async (newSection: Section, { rejectWithValue }) => {
        try {
            const response = await api.sections.sectionsCreate(newSection);
            return response.data
        } catch {
            return rejectWithValue('Не удалось создать секцию')
        }
    }
);

const sectionsSlice = createSlice({
    name: 'sections',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSections.pending, (state) => {
                state.loading = true
                state.error = false
            })
            .addCase(fetchSections.fulfilled, (state, action) => {
                const data = action.payload;
                state.data.sections = data.sections;
                state.data.applicationSectionsCounter = data.number_of_sections;
                state.data.draftApplicationID = data.draft_application_id;

                state.error = false
                state.loading = false
            })
            .addCase(fetchSections.rejected, (state) => {
                state.error = true
                state.loading = false
            })

            .addCase(addSectionToDraft.fulfilled, (state, action) => {
                const data = action.payload;
                state.data.applicationSectionsCounter = data.number_of_sections;
                state.data.draftApplicationID = data.draft_application_id;
            })
            .addCase(addSectionToDraft.rejected, (state) => {
                state.error = true
            })

            .addCase(createSection.fulfilled, (state, action) => {
                const data = action.payload;
                state.data.sections = [...state.data.sections, data];
            })
            .addCase(createSection.rejected, (state) => {
                state.error = true
            })
    }
});

export default sectionsSlice.reducer;
