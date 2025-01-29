import { combineReducers } from "redux";
import onlineUsersReducer from "./onlineUsersReducer";
import offlineUsersReducer from "./offlineUsersReducer";
import baseConfigReducer from "./baseConfigReducer";

const allReducers=combineReducers({
    baseConfig:baseConfigReducer,
    onlineUsers:onlineUsersReducer,
    offlineUsers:offlineUsersReducer,
});

export default allReducers;