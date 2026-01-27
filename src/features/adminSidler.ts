import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAdminSliderOpen: false,
};
const adminSliderReducer=createSlice({
    name:"adminSlider",
    initialState,   
    reducers:{
        toggleAdminSlider:(state)=>{
            state.isAdminSliderOpen=!state.isAdminSliderOpen;
        }
    }
});
export const {toggleAdminSlider}=adminSliderReducer.actions;
export default adminSliderReducer.reducer;