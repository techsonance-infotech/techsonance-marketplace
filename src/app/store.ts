import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import { adminThemeReducer } from '../features/theme/adminThemeSlice';
import sidebarReducer from "../features/sidebar"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        adminTheme: adminThemeReducer,
        sidebar: sidebarReducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

