import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  user: { username: string | null; id: number | null };
}

const loadAuthStateFromLocalStorage = () => {
    const authState = localStorage.getItem('auth');
    return authState ? JSON.parse(authState) : { isAuthenticated: false, user: { username: null, id: null } };
};
  
const saveAuthStateToLocalStorage = (authState: AuthState) => {
    localStorage.setItem('auth', JSON.stringify(authState));
};

const initialState: AuthState = loadAuthStateFromLocalStorage();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ username: string; id: number }>) {
      state.isAuthenticated = true;
      state.user = action.payload;
      saveAuthStateToLocalStorage(state)
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = { username: null, id: null };
      saveAuthStateToLocalStorage(state)
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;