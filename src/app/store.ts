import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import { adminThemeReducer } from '../features/theme/adminThemeSlice';
import sidebarReducer from "../features/sidebar"
import menuReducer from "../features/menuBar"
import { CartReducer } from '../features/Cart';
import { cartSidebarReducer } from '../features/CartSidebar';



export const store = configureStore({
    reducer: {
        auth: authReducer,
        adminTheme: adminThemeReducer,
        sidebar: sidebarReducer,
        menu: menuReducer,
        cart: CartReducer,
        cartSidebar: cartSidebarReducer,

        
    },
});
store.subscribe(() => {
    localStorage.setItem('cart', JSON.stringify(store.getState().cart.items));
    localStorage.setItem('total', JSON.stringify(store.getState().cart.total));
})
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

