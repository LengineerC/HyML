import { createSlice } from "@reduxjs/toolkit";

export const userSlice=createSlice({
    name:"user",
    initialState:{
        onlineUsers:[],
        offlineUsers:[],
    },
    reducers:{
        saveOnlineUsers(state,action){
            state.onlineUsers=action.payload;
        },
        clearOnlineUsers(state){
            state.onlineUsers=[];
        },

        saveOfflineUsers(state,action){
            state.offlineUsers=action.payload;
        },
        clearOfflineUsers(state){
            state.offlineUsers=[];
        },
    }
});

export const {
    saveOnlineUsers,
    clearOnlineUsers,
    saveOfflineUsers,
    clearOfflineUsers,
}=userSlice.actions;

export default userSlice.reducer;