import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAdminSidlerOpen: false,
};
const adminSliderReducer=createSlice({
    name:"adminSlider",
    initialState,   
    reducers:{
        toggleAdminSlider:(state)=>{
            state.isAdminSidlerOpen=!state.isAdminSidlerOpen;
        }
    }
});
export const {toggleAdminSlider}=adminSliderReducer.actions;
export default adminSliderReducer.reducer;