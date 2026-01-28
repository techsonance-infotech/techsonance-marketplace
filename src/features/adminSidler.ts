import { createSlice } from "@reduxjs/toolkit";
export type isAdminSliderType={
    isAdminSliderOpen:boolean
}
const initialState: isAdminSliderType = {
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