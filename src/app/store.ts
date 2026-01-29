import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import { adminThemeReducer } from '../features/theme/adminThemeSlice';
import adminSidebarReducer from "../features/adminSidebar"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        adminTheme: adminThemeReducer,
        adminSidebar: adminSidebarReducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

