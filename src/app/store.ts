import { configureStore } from '@reduxjs/toolkit';
import { adminThemeReducer } from '../features/theme/adminThemeSlice';
import { CartReducer } from '../features/Cart';
import { cartSidebarReducer } from '../features/CartSidebar';
import { menuReducer } from '../features/menuBar';
import { sidebarReducer } from '../features/sidebar';
import { authReducer } from '../features/auth/authSlice';
import { WishlistReducer } from '../features/Wishlist';

const localStorageMiddleware = store => next => action => {
    try {
        console.log('Dispatching action:', action);

        const result = next(action);
        if (action.type.startsWith('cart/')) {
            const cartState = store.getState().cart;
            if (Array.isArray(cartState.items)) {
                localStorage.setItem('cart', JSON.stringify(cartState));
                console.log('LocalStorage updated:', action.type, cartState);
            }
        }
        if (action.type.startsWith('auth/')) {
            const authState = store.getState().auth;
            localStorage.setItem('auth', JSON.stringify(authState));
            console.log('LocalStorage updated:', action.type, authState);
        }
        if (action.type.startsWith('cartSidebar/')) {
            const cartSidebarState = store.getState().cartSidebar;
            localStorage.setItem('cartSidebar', JSON.stringify(cartSidebarState));
            console.log('LocalStorage updated:', action.type, cartSidebarState);
        }
        if (action.type.startsWith('wishlist/')) {
            const wishlistState = store.getState().wishlist;
            localStorage.setItem('wishlist', JSON.stringify(wishlistState));
            console.log('LocalStorage updated:', action.type, wishlistState);
        }
        return result;
    } catch (error) {
        console.error('CRASH IN REDUCER FOR ACTION:', action.type);
        console.error('The exact error is:', error);
        throw error;
    }
}

export const store = configureStore({
    reducer: {
        auth: authReducer,
        adminTheme: adminThemeReducer,
        sidebar: sidebarReducer,
        menu: menuReducer,
        cart: CartReducer,
        cartSidebar: cartSidebarReducer,
        wishlist: WishlistReducer,

    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(localStorageMiddleware),

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

