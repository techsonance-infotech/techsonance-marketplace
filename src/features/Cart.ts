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
 
        if (serializedCart  ) {
            return { items: JSON.parse(serializedCart) };
        }
    } catch (e) {
        console.error("Could not load cart from localStorage", e);
    }
}
const initialState: {
    items: CartItem[];
    
} = {
    items: loadCartFromLocalStorage()?.items || [],
 
}
const CartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const existingItem = state.items.find(item => item.id === action.payload.id);
            if (existingItem && action.payload.user_id === existingItem.userId) {
                existingItem.quantity += 1;
            }
            else {
                state.items.push({ ...action.payload, quantity: 1 });
            }

        },
        removeFromCart: (state, action) => {
            const existingItem = state.items.find(item => item.id === action.payload.id);
            if (existingItem && action.payload.user_id === existingItem.userId) {

                state.items = state.items.filter(item => item.id !== action.payload.id);
            }
        },

        updateQuantity: (state, action) => {
            const existingItem = state.items.find(item => item.id === action.payload.id);
            if (existingItem && action.payload.user_id === existingItem.userId) {

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