import { createSlice } from "@reduxjs/toolkit";
export type MenuState = {
    isMenuOpen: boolean;
}
const initialState: MenuState = {
    isMenuOpen: false,
};
const menuReducer = createSlice({
    name: "menu",
    initialState,
    reducers: {
        openMenu: (state) => { state.isMenuOpen = true; },
        closeMenu: (state) => { state.isMenuOpen = false; }
    }
});
export const { openMenu, closeMenu } = menuReducer.actions;
export default menuReducer.reducer;