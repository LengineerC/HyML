import {saveOnlineUsers,clearOnlineUsers} from "../actions/constants";

const initState=[];

export default function onlineUsersReducer(prevState=initState,action){
    const {payload,type}=action;

    switch(type){
        case saveOnlineUsers:
        case clearOnlineUsers:
            return payload;

        default:
            return prevState
    }
}