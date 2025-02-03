import { createSlice } from "@reduxjs/toolkit";

export const configSlice=createSlice({
    name:"config",
    initialState:{
        baseConfig:{},
    },
    reducers:{
        saveBaseConfig(state,action){
            state.baseConfig=action.payload;
        },
        clearBaseConfig(state){
            state.baseConfig={};
        },
    }
});

export const {
    saveBaseConfig,
    clearBaseConfig,
}=configSlice.actions;

export default configSlice.reducer;