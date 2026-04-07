import { createSlice } from "@reduxjs/toolkit";

interface CartItem {
    cartId: string;
    cartItemId: string;
    quantity: number;
    productVariantId: string;
}

const isClient = typeof window !== 'undefined';

const loadCartFromLocalStorage = () => {
    if (!isClient) return { items: [] };
    try {
        const serializedCart = localStorage.getItem('cart');
        if (serializedCart) {
            const parsedCart = JSON.parse(serializedCart);
            if (parsedCart && Array.isArray(parsedCart.items)) {
                return parsedCart;
            } else {
                return { items: [] };
            }
        }
    } catch (e) {
        console.error("Could not load cart from localStorage", e);
    }
    return { items: [] };
}

const initialState: { items: CartItem[] } = {
    items: loadCartFromLocalStorage().items || [],
}

const CartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const existingItem = Array.isArray(state.items) ? state.items.find(item => item.productVariantId === action.payload.productVariantId) : undefined;
            if (existingItem) {
                existingItem.quantity = action.payload.quantity;
            } else {
                state.items.push({ ...action.payload, quantity: 1 });
            }
        },
        removeFromCart: (state, action) => {
            const existingItem = Array.isArray(state.items) ? state.items.find(item => item.productVariantId === action.payload.productVariantId) : undefined;
            if (existingItem) {
                if (existingItem.quantity > 1) {
                    existingItem.quantity -= 1;
                }
                else {
                    state.items = Array.isArray(state.items) ? state.items.filter(item => item.productVariantId !== action.payload.productVariantId) : [];
                }
            }
        },
        clearCart: (state) => {
            state.items = [];
        }
    }
});

export const { addToCart, removeFromCart, clearCart } = CartSlice.actions;
export const CartReducer = CartSlice.reducer;
