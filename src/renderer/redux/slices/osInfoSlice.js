import { createSlice } from "@reduxjs/toolkit";

export const osInfoSlice=createSlice({
    name:"osInfo",
    initialState:{
        totalMemory:0,
    },
    reducers:{
        saveTotalMemory(state,action){
            state.totalMemory=action.payload;
        },
        
    },
});

export const {
    saveTotalMemory,
}=osInfoSlice.actions;

export default osInfoSlice.reducer;