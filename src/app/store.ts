import { configureStore } from '@reduxjs/toolkit';
import { adminThemeReducer } from '../features/theme/adminThemeSlice';
import { CartReducer } from '../features/Cart';
import { cartSidebarReducer } from '../features/CartSidebar';
import { authReducer } from '../features/auth/authSlice';
import { menuReducer } from '../features/menuBar';
import { sidebarReducer } from '../features/sidebar';



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
})
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

