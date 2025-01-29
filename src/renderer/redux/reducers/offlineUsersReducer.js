import {SAVE_OFFLINE_USERS,CLEAR_OFFLINE_USERS} from "../actions/constants";

const initState=[];

export default function onlineUsersReducer(prevState=initState,action){
    const {payload,type}=action;

    switch(type){
        case SAVE_OFFLINE_USERS:
            return payload;

        case CLEAR_OFFLINE_USERS:
            return initState;

        default:
            return prevState;
    }
}