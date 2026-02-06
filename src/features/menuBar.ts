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
        toggleMenu: (state) => {
            if(window.innerWidth < 768) {

                state.isMenuOpen = true;
            }
            else {
                state.isMenuOpen = false;
            }
        }
        }
    });
export const { toggleMenu } = menuReducer.actions;
export default menuReducer.reducer;