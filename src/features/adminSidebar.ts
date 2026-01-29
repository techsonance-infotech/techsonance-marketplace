import { createSlice } from "@reduxjs/toolkit";
export type isAdminSidebarType={
    isAdminSidebarOpen:boolean
}
const initialState: isAdminSidebarType = {
  isAdminSidebarOpen: false,
};
const adminSidebarReducer=createSlice({
    name:"adminSidebar",
    initialState,   
    reducers:{
        toggleAdminSidebar:(state)=>{
            state.isAdminSidebarOpen=!state.isAdminSidebarOpen;
        }
    }
});
export const {toggleAdminSidebar}=adminSidebarReducer.actions;
export default adminSidebarReducer.reducer;