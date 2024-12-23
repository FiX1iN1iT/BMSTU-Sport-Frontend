import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api';
import { Section, SportApplication } from '../api/Api';

interface ApplicationStateData {
    sections: Section[];
    applicaiton: SportApplication | null;
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
    async (applicationId: string, { rejectWithValue }) => {
        try {
            const response = await api.applications.applicationsRead(applicationId);
            return response.data
        } catch {
            return rejectWithValue('Не удалось получить заявку по id')
        }
    }
);

export const increasePriority = createAsyncThunk(
    'application/increasePriority',
    async ({ applicationId, sectionId }: { applicationId: string; sectionId: string }, { rejectWithValue }) => {
        try {
            const response = await api.applications.applicationsPriorityUpdate(applicationId, sectionId);
            return response.data
        } catch {
            return rejectWithValue('Не удалось получить увеличить приоритет секции')
        }
    }
);

export const removeSection = createAsyncThunk(
    'application/removeSection',
    async ({ applicationId, sectionId }: { applicationId: string; sectionId: string }, { rejectWithValue }) => {
        try {
            const response = await api.applications.applicationsPriorityDelete(applicationId, sectionId);
            return response.data
        } catch {
            return rejectWithValue('Не удалось удалить секцию из заявки')
        }
    }
);

export const changeFullName = createAsyncThunk(
    'application/changeFullName',
    async ({ applicationId, updatedApplication }: { applicationId: string; updatedApplication: SportApplication }, { rejectWithValue }) => {
        try {
            const response = await api.applications.applicationsUpdate(applicationId, updatedApplication);
            return response.data
        } catch {
            return rejectWithValue('Не удалось изменить ФИО в заявке')
        }
    }
);

export const deleteApplication = createAsyncThunk(
    'application/deleteApplication',
    async (applicationId: string, { rejectWithValue }) => {
        try {
            const response = await api.applications.applicationsDelete(applicationId);
            return response.data
        } catch {
            return rejectWithValue('Не удалось удалить заявку')
        }
    }
);

export const submitApplication = createAsyncThunk(
    'application/submitApplication',
    async (applicationId: string, { rejectWithValue }) => {
        try {
            const response = await api.applications.applicationsSubmitUpdate(applicationId);
            return response.data
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
                state.data.sections = data.sections;
                state.data.applicaiton = data.application;

                state.error = false
                state.loading = false
            })
            .addCase(fetchApplication.rejected, (state) => {
                state.error = true
                state.loading = false
            })

            .addCase(increasePriority.fulfilled, (state, action) => {
                const data = action.payload;
                state.data.sections = data.sections;
            })
            .addCase(increasePriority.rejected, (state) => {
                state.error = true
            })

            .addCase(removeSection.fulfilled, (state, action) => {
                const data = action.payload;
                state.data.sections = data.sections;
            })
            .addCase(removeSection.rejected, (state) => {
                state.error = true
            })

            .addCase(changeFullName.fulfilled, (state, action) => {
                const data = action.payload;
                state.data.applicaiton = data;
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
