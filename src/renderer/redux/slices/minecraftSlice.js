import { createSlice } from "@reduxjs/toolkit";

export const minecraftSlice=createSlice({
    name:"minecraft",
    initialState:{
        mcVersions:[],
        installedMcVersions:[],
    },
    reducers:{
        saveMcVersions(state,action){
            state.mcVersions=action.payload;
        },
        clearMcVersions(state){
            state.mcVersions=[];
        },

        saveInstalledMcVersions(state,action){
            state.installedMcVersions=action.payload;
        },
        clearInstalledMcVersions(state){
            state.installedMcVersions=[];
        },
    }
});

export const {
    saveMcVersions,
    clearMcVersions,
    saveInstalledMcVersions,
    clearInstalledMcVersions,
}=minecraftSlice.actions;

export default minecraftSlice.reducer;