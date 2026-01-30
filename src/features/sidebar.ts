import { createSlice } from "@reduxjs/toolkit";
export type isSidebarType = {
    isSidebarOpen: boolean
}
const initialState: isSidebarType = {
    isSidebarOpen: false,
};
const sidebarReducer = createSlice({
    name: "sidebar",
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.isSidebarOpen = !state.isSidebarOpen;
        }
    }
});
export const { toggleSidebar } = sidebarReducer.actions;
export default sidebarReducer.reducer;
