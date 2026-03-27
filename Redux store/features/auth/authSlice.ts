import { createSlice } from '@reduxjs/toolkit';
import { RoleDefinition, UserProfile, UserRole } from '../../../utils/Types';

const isClient = typeof window !== 'undefined';
const AUTH_TOKEN = 'authToken';
const USER_STORAGE_KEY = 'user';
const getUserFromLocalStorage = () => {
    if (!isClient) return null;
    try {
        const serializedUser = localStorage.getItem(USER_STORAGE_KEY);
        if (serializedUser !==undefined && serializedUser !== null) {
            return JSON.parse(serializedUser);
        } else {
            return null;
        }
    }
    catch (e) {
        console.error("Could not load user from localStorage", e);
        return null;
    }
}

export interface AuthType {
    isAuthenticated: boolean;
    user: Partial<UserProfile> | null;
    loading: boolean;
    error: string | null;
    token: string | null;
    role: UserRole;
}


const initialState: AuthType = {
    isAuthenticated: isClient ? !!localStorage.getItem(AUTH_TOKEN) : false,
    user: getUserFromLocalStorage(), // Load user from localStorage if available
    loading: false,
    error: null,
    token: isClient ? localStorage.getItem(AUTH_TOKEN) : null,
    role: UserRole.Customer,
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
        loginSuccess(state, action: { payload: { user: any, token: string, role: UserRole } }) {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.role = action.payload.role;
            state.loading = false;
            state.error = null;
            if (isClient) {
                localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(action.payload));
                localStorage.setItem(AUTH_TOKEN, action.payload.token);
            }
        },
        logOut(state) {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            state.loading = false;
            state.error = null;
            if (isClient) {
                localStorage.removeItem(AUTH_TOKEN);
                localStorage.removeItem(USER_STORAGE_KEY);
                localStorage.removeItem('cart');
            }
        },

        // ========== USER PROFILE MANAGEMENT ==========
        updateUserProfile: (state, action) => {
            if (state.user) {
                Object.assign(state.user, action.payload);
            }
        },

        // ========== ADDRESS MANAGEMENT ==========
        createAddress: (state, action) => {
            if (state.user) {
                state.user.addresses.push(action.payload);
            }
        },

        updateAddress: (state, action) => {
            if (state.user) {
                const index = state.user.addresses.findIndex(
                    address => address.address_id === action.payload.address_id
                );
                if (index !== -1) {
                    state.user.addresses[index] = action.payload;
                }
            }
        },

        deleteAddress: (state, action) => {
            if (state.user) {
                state.user.addresses = state.user.addresses.filter(
                    address => address.address_id !== action.payload
                );
            }
        },

        setDefaultAddress: (state, action) => {
            if (state.user) {
                state.user.addresses.forEach(address => {
                    address.is_default = false;
                });
                const address = state.user.addresses.find(
                    addr => addr.address_id === action.payload
                );
                if (address) {
                    address.is_default = true;
                }
            }
        }
    }
});

export const {
    loginStart,
    loginFailure,
    loginSuccess,
    logOut,
    updateUserProfile,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
} = authSlice.actions;

export const authReducer = authSlice.reducer;