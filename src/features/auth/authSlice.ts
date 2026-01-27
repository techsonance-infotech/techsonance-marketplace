import { createSlice } from '@reduxjs/toolkit';
export const UserRole = {
    Admin: 'admin',
    Vendor: 'vendor',
    Customer: 'customer'
} as const;

// This creates a type from the object values
export type UserRole = typeof UserRole[keyof typeof UserRole];
type Permission = 'read' | 'create' | 'delete' | 'update';
interface RoleDefinition {
    can: Permission[];
}
export const role: Record<UserRole, RoleDefinition> = {
    [UserRole.Admin]: {
        can: ['read', 'create', 'delete', 'update']
    },
    [UserRole.Vendor]: {
        can: ['read', 'create', 'update']
    },
    [UserRole.Customer]: {
        can: ['read']
    }
}


export interface User {
    user_id: String;
    company_id: String;
    user_role_type: UserRole;
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
    role: Record<UserRole, RoleDefinition>;
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