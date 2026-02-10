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
        const serializedTotal = localStorage.getItem('total');
        if (serializedCart && serializedTotal) {
            return { items: JSON.parse(serializedCart), total: JSON.parse(serializedTotal) };
        }
    } catch (e) {
        console.error("Could not load cart from localStorage", e);
    }
}
const initialState:{
    items: CartItem[];
    total: number;
} = {
    items: loadCartFromLocalStorage()?.items || [],
    total: loadCartFromLocalStorage()?.total || 0
}
const CartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const existingItem = state.items.find(item => item.id === action.payload.id);
            if (existingItem) {
                existingItem.quantity += 1;
            }
            else {
                state.items.push({ ...action.payload, quantity: 1 });
            }
            state.total += action.payload.price;
        },
        removeFromCart: (state, action) => {
            const existingItem = state.items.find(item => item.id === action.payload.id);
            if (existingItem) {
                state.total -= existingItem.price * existingItem.quantity;
                state.items = state.items.filter(item => item.id !== action.payload.id);
            }
        },

        updateQuantity: (state, action) => {
            const existingItem = state.items.find(item => item.id === action.payload.id);
            if (existingItem) {
                state.total -= existingItem.price * existingItem.quantity;
                existingItem.quantity = action.payload.quantity;
                state.total += existingItem.price * existingItem.quantity;
            }
        },
        clearCart: (state) => {
            state.items = [];
            state.total = 0;
        }
    }
});
export const { addToCart, removeFromCart, updateQuantity, clearCart } = CartSlice.actions;
export const CartReducer = CartSlice.reducer;