import { combineReducers } from "redux";
import onlineUsersReducer from "./onlineUsersReducer";
import offlineUsersReducer from "./offlineUsersReducer";
import baseConfigReducer from "./baseConfigReducer";
import osInfoReducer from "./osInfoReducer";
import mcVersionsReducer from './mcVersionsReducer';

const allReducers=combineReducers({
    osInfo:osInfoReducer,
    baseConfig:baseConfigReducer,
    onlineUsers:onlineUsersReducer,
    offlineUsers:offlineUsersReducer,
    mcVersions:mcVersionsReducer,
});

export default allReducers;