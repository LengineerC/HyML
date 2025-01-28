import * as actions from "./constants";

const saveOnlineUsers=payload=>({
    type:actions.saveOnlineUsers,
    payload
});
const clearOnlineUsers=()=>({
    type:actions.clearOnlineUsers,
    payload:[]
});

const saveOfflineUsers=payload=>({
    type:actions.saveOffllineUsers,
    payload,
});
const clearOfflineUsers=()=>({
    type:actions.clearOfflineUsers,
    payload:[]
});