import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import client from '../graphql/client';
import { SportApplicationV2, SectionV2, FETCH_APPLICATION, UPDATE_APPLICATION, DELETE_APPLICATION, SUBMIT_APPLICATION, REMOVE_SECTION, INCREASE_PRIORITY } from '../graphql/graphql';

interface ApplicationStateData {
    sections: SectionV2[];
    applicaiton: SportApplicationV2 | null;
}

interface ApplicationState {
    data: ApplicationStateData;
    loading: boolean;
    error: boolean;
}

const initialState: ApplicationState = {
    data: { sections: [], applicaiton: null },
    loading: true,
    error: false
};

export const fetchApplication = createAsyncThunk(
    'application/fetchApplication',
    async (applicationId: number, { rejectWithValue }) => {
        try {
            const response = await client.query({
                query: FETCH_APPLICATION,
                variables: { applicationId },
            });
            return response.data;
        } catch {
            return rejectWithValue('Не удалось получить заявку по id')
        }
    }
);

export const increasePriority = createAsyncThunk(
    'application/increasePriority',
    async ({ applicationId, sectionId }: { applicationId: number; sectionId: number }, { rejectWithValue }) => {
        try {
            const response = await client.mutate({
                mutation: INCREASE_PRIORITY,
                variables: { applicationId, sectionId },
            });
            return response.data.increasePriority.sectionsByApplication;
        } catch {
            return rejectWithValue('Не удалось получить увеличить приоритет секции')
        }
    }
);

export const removeSection = createAsyncThunk(
    'application/removeSection',
    async ({ applicationId, sectionId }: { applicationId: number; sectionId: number }, { rejectWithValue }) => {
        try {
            const response = await client.mutate({
                mutation: REMOVE_SECTION,
                variables: { applicationId, sectionId },
            });
            return response.data.removeSection.sectionsByApplication;
        } catch {
            return rejectWithValue('Не удалось удалить секцию из заявки')
        }
    }
);

export const changeFullName = createAsyncThunk(
    'application/changeFullName',
    async ({ applicationId, updatedApplication }: { applicationId: number; updatedApplication: SportApplicationV2 }, { rejectWithValue }) => {
        try {
            const response = await client.mutate({
                mutation: UPDATE_APPLICATION,
                variables: { applicationId, input: { fullName: updatedApplication.fullName } },
            });
            return response.data.updateApplication.application;
        } catch {
            return rejectWithValue('Не удалось изменить ФИО в заявке')
        }
    }
);

export const deleteApplication = createAsyncThunk(
    'application/deleteApplication',
    async (applicationId: number, { rejectWithValue }) => {
        try {
            const response = await client.mutate({
                mutation: DELETE_APPLICATION,
                variables: { applicationId },
            });
            return response.data.deleteApplication.success;
        } catch {
            return rejectWithValue('Не удалось удалить заявку')
        }
    }
);

export const submitApplication = createAsyncThunk(
    'application/submitApplication',
    async (applicationId: number, { rejectWithValue }) => {
        try {
            const response = await client.mutate({
                mutation: SUBMIT_APPLICATION,
                variables: { applicationId },
            });
            return response.data.submitApplication.success;
        } catch {
            return rejectWithValue('Не удалось сформировать заявку')
        }
    }
);

const applicationSlice = createSlice({
    name: 'application',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchApplication.pending, (state) => {
                state.loading = true
                state.error = false
            })
            .addCase(fetchApplication.fulfilled, (state, action) => {
                const data = action.payload;
                state.data.sections = data.sectionsByApplication;
                state.data.applicaiton = data.applicationDetail;

                state.error = false
                state.loading = false
            })
            .addCase(fetchApplication.rejected, (state) => {
                state.error = true
                state.loading = false
            })

            .addCase(increasePriority.fulfilled, (state, action) => {
                const data = action.payload;
                state.data.sections = data;
            })
            .addCase(increasePriority.rejected, (state) => {
                state.error = true
            })

            .addCase(removeSection.fulfilled, (state, action) => {
                const data = action.payload;
                state.data.sections = data;
            })
            .addCase(removeSection.rejected, (state) => {
                state.error = true
            })

            .addCase(changeFullName.fulfilled, (state, action) => {
                const data = action.payload;
                state.data.applicaiton = data.application;
            })
            .addCase(changeFullName.rejected, (state) => {
                state.error = true
            })

            .addCase(deleteApplication.fulfilled, (state) => {
                state.data.sections = [];
                state.data.applicaiton = null;
            })
            .addCase(deleteApplication.rejected, (state) => {
                state.error = true
            })

            .addCase(submitApplication.fulfilled, (state) => {
                state.data.sections = [];
                state.data.applicaiton = null;
            })
            .addCase(submitApplication.rejected, (state) => {
                state.error = true
            })
    }
});

export default applicationSlice.reducer;
