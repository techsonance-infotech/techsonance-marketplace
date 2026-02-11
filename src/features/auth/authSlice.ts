import { createSlice } from '@reduxjs/toolkit';
import type { RoleDefinition, UserProfile, UserRole } from '../../utils/Types';
import { getUserFromLocalStorage, MockUser } from '../UserSlice';
import { get } from 'react-hook-form';




export interface AuthType {
    isAuthenticated: boolean;
    user: UserProfile | null;
    loading: boolean;
    error: string | null;
    token: string | null;
    role: Record<UserRole, RoleDefinition>;
}
    
const AUTH_TOKEN = 'authToken';
const initialState = {
    isAuthenticated: !!localStorage.getItem(AUTH_TOKEN),
    user:getUserFromLocalStorage(), 
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
            localStorage.removeItem(AUTH_TOKEN);    
            localStorage.setItem(AUTH_TOKEN, '');
            state.token = null;
            localStorage.setItem(AUTH_TOKEN, '');
        }

    }
})
export const { loginStart, loginFailure, loginSuccess, logOut } = authSlice.actions;
export const authReducer = authSlice.reducer;