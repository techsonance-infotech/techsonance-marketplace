import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isCartOpen: false,
};
const cartSidebarSlice = createSlice({
    name: "cartSidebar",
    initialState,
    reducers: {
        toggleCartSidebar: (state, action) => {
            if (action.payload === "close") {
                state.isCartOpen = false;
                return;
            }else if (action.payload === "open") {
                state.isCartOpen = true;
                return;
            }
            state.isCartOpen = !state.isCartOpen;
        }
    },
});

export const { toggleCartSidebar } = cartSidebarSlice.actions;
export const cartSidebarReducer = cartSidebarSlice.reducer;