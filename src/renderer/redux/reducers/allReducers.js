import { combineReducers } from "redux";
import onlineUsersReducer from "./onlineUsersReducer";
import offlineUsersReducer from "./offlineUsersReducer";

const allReducers=combineReducers({
    onlineUsers:onlineUsersReducer,
    offlineUsers:offlineUsersReducer,
});

export default allReducers;