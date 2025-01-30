import { CLEAR_MC_VERSIONS, SAVE_MC_VERSIONS } from "../actions/constants";

const initState=[];

export default function mcVersionsReducer(prevState=initState,action){
    const {type,payload}=action;

    switch(type){
        case SAVE_MC_VERSIONS:
            return payload;

        case CLEAR_MC_VERSIONS:
            return initState;

        default:
            return prevState;
    }
}