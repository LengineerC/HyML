import {saveOfflineUsers,clearOfflineUsers} from "../actions/constants";

const initState=[];

export default function onlineUsersReducer(prevState=initState,action){
    const {payload,type}=action;

    switch(type){
        case saveOfflineUsers:
        case clearOfflineUsers:
            return payload;

        default:
            return prevState;
    }
}