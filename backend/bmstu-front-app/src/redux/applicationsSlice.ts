import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api';
import { SportApplication } from '../api/Api';

interface ApplicationsStateData {
    creators: string[];
    applications: SportApplication[];
}

interface ApplicationsState {
    data: ApplicationsStateData;
    loading: boolean;
    error: boolean;
}

const initialState: ApplicationsState = {
    data: { creators: [], applications: [] },
    loading: true,
    error: false
};

export const fetchApplications = createAsyncThunk(
    'applications/fetchApplications',
    async ({ startDate, endDate, status }: { startDate: string, endDate: string, status: string }, { rejectWithValue }) => {
        try {
            const response = await api.applications.applicationsList({ start_apply_date: startDate, end_apply_date: endDate, status: status });
            return response.data
        } catch {
            return rejectWithValue('Не удалось получить список заявок')
        }
    }
);

export const changeStatus = createAsyncThunk(
    'applications/changeStatus',
    async ({ applicationId, status }: { applicationId: string; status: string }, { rejectWithValue }) => {
        try {
            const response = await api.applications.applicationsApproveRejectUpdate(applicationId, { status: status });
            return response.data
        } catch {
            return rejectWithValue('Не удалось изменить статус заявки')
        }
    }
);

const applicationsSlice = createSlice({
    name: 'applications',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchApplications.pending, (state) => {
                state.error = false
            })
            .addCase(fetchApplications.fulfilled, (state, action) => {
                const data = action.payload;
                state.data.applications = data.applications;

                const creators = data.applications.map(app => app.creator);
                const uniqueCreators = new Set(creators);
                state.data.creators = (Array.from(uniqueCreators));

                state.error = false
                state.loading = false
            })
            .addCase(fetchApplications.rejected, (state) => {
                state.error = true
                state.loading = false
            })

            .addCase(changeStatus.fulfilled, (state) => {
                state.error = false
            })
            .addCase(changeStatus.rejected, (state) => {
                state.error = true
            })
    }
});

export default applicationsSlice.reducer;
