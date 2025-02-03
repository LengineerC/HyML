import { createSlice } from "@reduxjs/toolkit";

export const minecraftSlice=createSlice({
    name:"minecraft",
    initialState:{
        online:true,
        mcVersions:[],
        installedMcVersions:[],
        currentMcOptions:{},
    },
    reducers:{
        saveOnline(state,action){
            state.online=action.payload;
        },

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

        saveCurrentMcOptions(state,action){
            state.currentMcOptions=action.payload;
        },
        clearCurrentMcOptions(state){
            state.currentMcOptions={};
        },

    }
});

export const {
    saveOnline,
    saveMcVersions,
    clearMcVersions,
    saveInstalledMcVersions,
    clearInstalledMcVersions,
    saveCurrentMcOptions,
    clearCurrentMcOptions,
}=minecraftSlice.actions;

export default minecraftSlice.reducer;