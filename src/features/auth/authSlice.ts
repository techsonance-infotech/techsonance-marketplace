import { createSlice } from '@reduxjs/toolkit';
export interface User {
    user_id: String;
    company_id: String;
    user_role_type: 'customer' | 'vendor' | 'admin';
    name: String;
    email: String;
    phone: String;
    user_status: "Active" | " Inactive" | " Banned"
}

export interface AuthType {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    error: string | null;
    token: string | null;
}

const AUTH_TOKEN = 'authToken';
const initialState = {
    isAuthenticated: !!localStorage.getItem(AUTH_TOKEN),
    user: null,
    loading: false,
    error: null,
    token: localStorage.getItem(AUTH_TOKEN) || null,
};
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart(state) {
            state.loading = true;
            state.error = null;
        },
        loginFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        loginSuccess(state, action) {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            localStorage.setItem(AUTH_TOKEN, action.payload.token);
        },
        logOut(state) {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            localStorage.setItem(AUTH_TOKEN, '');
        }

    }
})
export const { loginStart, loginFailure, loginSuccess, logOut } = authSlice.actions;
export default authSlice.reducer;