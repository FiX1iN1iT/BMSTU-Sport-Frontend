import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api';

interface AuthState {
  isAuthenticated: boolean;
  user: { username: string | null; id: number | null };
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: { username: null, id: null }
};

export const loginUser = createAsyncThunk(
    'auth/login',
    async ({ email, password }: { email: string; password: string }) => {
        const response = await api.login.loginCreate({ email, password });
        return { username: email, id: response.data.pk };
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async () => {
        const response = await api.logout.logoutCreate();
        return {};
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ username: string; id: number }>) => {
                state.isAuthenticated = true;
                state.user = action.payload;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.isAuthenticated = false;
                state.user = { username: null, id: null };
            })
    }
});

export default authSlice.reducer;