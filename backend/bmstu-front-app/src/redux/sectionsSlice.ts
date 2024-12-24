import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import client from '../graphql/client';
import { SectionV2, FETCH_SECTIONS, CREATE_SECTION, ADD_SECTION_TO_DRAFT } from '../graphql/graphql';

interface SectionsStateData {
    sections: SectionV2[];
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
            const response = await client.query({
                query: FETCH_SECTIONS,
                variables: { sectionTitle: searchValue }
            });
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
            const response = await client.mutate({
                mutation: ADD_SECTION_TO_DRAFT,
                variables: { sectionId: Number(sectionId) },
            });
            return response.data.addSectionToDraft.response;
        } catch {
            return rejectWithValue('Не удалось добавить секцию к заявке-черновику')
        }
    }
);

export const createSection = createAsyncThunk(
    'sections/createSection',
    async (newSection: SectionV2, { rejectWithValue }) => {
        try {
            const response = await client.mutate({
                mutation: CREATE_SECTION,
                variables: { title: newSection.title }
            });
            return response.data.createSection.section;
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
                state.data.applicationSectionsCounter = data.numberOfSections;
                state.data.draftApplicationID = data.draftApplicationId;

                state.error = false
                state.loading = false
            })
            .addCase(fetchSections.rejected, (state) => {
                state.error = true
                state.loading = false
            })

            .addCase(addSectionToDraft.fulfilled, (state, action) => {
                const data = action.payload;
                state.data.applicationSectionsCounter = data.numberOfSections;
                state.data.draftApplicationID = data.draftApplicationId;
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
