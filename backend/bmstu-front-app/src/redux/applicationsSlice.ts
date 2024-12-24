import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import client from '../graphql/client';
import { SportApplicationV2, FETCH_APPLICATIONS, CHANGE_STATUS } from '../graphql/graphql';

interface ApplicationsStateData {
    creators: string[];
    applications: SportApplicationV2[];
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
            const response = await client.query({
                query: FETCH_APPLICATIONS,
                variables: {
                    startApplyDate: startDate,
                    endApplyDate: endDate,
                    status,
                },
            });
            return response.data.applications;
        } catch {
            return rejectWithValue('Не удалось получить список заявок')
        }
    }
);

export const changeStatus = createAsyncThunk(
    'applications/changeStatus',
    async ({ applicationId, status }: { applicationId: string; status: string }, { rejectWithValue }) => {
        try {
            const response = await client.mutate({
                mutation: CHANGE_STATUS,
                variables: { applicationId: applicationId, status: status },
            });
            return response.data.application;
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
                const data = action.payload as SportApplicationV2[];
                state.data.applications = data;

                const creators = data.map(app => app.user?.email || '');
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
