import {SAVE_ONLINE_USERS,CLEAR_ONLINE_USERS} from "../actions/constants";

const initState=[];

export default function onlineUsersReducer(prevState=initState,action){
    const {payload,type}=action;

    switch(type){
        case SAVE_ONLINE_USERS:
            return payload;

        case CLEAR_ONLINE_USERS:
            return initState;

        default:
            return prevState;
    }
}