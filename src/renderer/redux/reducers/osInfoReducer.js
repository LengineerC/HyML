import { CLEAR_OS_INFO, SAVE_OS_INFO } from "../actions/constants";

const initState={};

export default function osInfoReducer(prevState=initState,action){
    const {payload,type}=action;

    switch(type){
        case SAVE_OS_INFO:
            return payload;
        
        case CLEAR_OS_INFO:
            return initState;

        default:
            return prevState;
    }
}