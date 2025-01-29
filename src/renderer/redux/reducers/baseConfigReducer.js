import { CLEAR_BASE_CONFIG, SAVE_BASE_CONFIG } from "../actions/constants";

const initState={};

export default function baseConfigReducer(prevState=initState,action){
    const {type,payload}=action;

    switch(type){
        case SAVE_BASE_CONFIG:
            return payload;
        
        case CLEAR_BASE_CONFIG:
            return initState;

        default:
            return prevState;
    }

}