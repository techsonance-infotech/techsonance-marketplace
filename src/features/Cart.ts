import { createSlice } from "@reduxjs/toolkit";
interface CartItem {
    userId: string;
    id: string;
    quantity: number;
    price: number;
}

const loadCartFromLocalStorage = () => {
    try {
        const serializedCart = localStorage.getItem('cart');

        if (serializedCart) {
            const parsedCart = JSON.parse(serializedCart);
            if (parsedCart && Array.isArray(parsedCart.items)) {
                return parsedCart;
            } else {
                console.warn("Invalid cart data in localStorage, resetting to initial state.");
                return { items: [] };
            }
        }
    } catch (e) {
        console.error("Could not load cart from localStorage", e);
    }
    return { items: [] };
}
const initialState: {
    items: CartItem[];

} = {
    items: loadCartFromLocalStorage() ? loadCartFromLocalStorage().items : [],

}
const CartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const existingItem = Array.isArray(state.items) ? state.items.find(item => item.id === action.payload.id) : undefined;
            if (existingItem) {
                existingItem.quantity += 1;
            }
            else {

                state.items.push({ ...action.payload, quantity: 1 });
            }
            console.log('Current state:', state);

        },
        removeFromCart: (state, action) => {
            const existingItem = Array.isArray(state.items) ? state.items.find(item => item.id === action.payload.id) : undefined;
            if (existingItem) {

                state.items = state.items.filter(item => item.id !== action.payload.id);
            }
            console.log('Current state:', state);
        },

        updateQuantity: (state, action) => {
            const existingItem = Array.isArray(state.items) ? state.items.find(item => item.id === action.payload.id) : undefined;
            if (existingItem) {
                existingItem.quantity = action.payload.quantity;

            }
        },
        clearCart: (state) => {
            state.items = [];

        }
    }
});
export const { addToCart, removeFromCart, updateQuantity, clearCart } = CartSlice.actions;
export const CartReducer = CartSlice.reducer;
