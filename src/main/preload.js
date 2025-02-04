const {contextBridge,ipcRenderer}=require('electron');

const {
  MAIN_API_EVENTS,
  WINDOW_API_EVENTS,
  FILE_API_EVENTS,
  ACCOUNT_API_EVENTS,
  OS_API_EVENTS,
  MINECRAFT_API_EVENTS,
}=require("./ipcEvents");

contextBridge.exposeInMainWorld("mainApi",{
  onMainProcessReady(callback){
    ipcRenderer.on(MAIN_API_EVENTS.MAIN_PROCESS_READY,()=>{
      // console.log("main-process-ready");
      callback();
    });
  }
});

contextBridge.exposeInMainWorld("osApi",{
  getTotalMemory(){
    return ipcRenderer.invoke(OS_API_EVENTS.GET_TOTAL_MEMORY);
  }
});

contextBridge.exposeInMainWorld('windowApi',{
  minimize(){
    ipcRenderer.send(WINDOW_API_EVENTS.MINIMIZE);
  },
  close(){
    ipcRenderer.send(WINDOW_API_EVENTS.CLOSE);
  }
});

contextBridge.exposeInMainWorld("fileApi",{
  getBaseConfig(){
    return ipcRenderer.invoke(FILE_API_EVENTS.READ_BASE_CONFIG);
  },

  updateBaseConfig(baseConfig){
    return ipcRenderer.invoke(FILE_API_EVENTS.UPDATE_BASE_CONFIG,baseConfig);
  },

  getOnlineUsers(callback){
    ipcRenderer.send(FILE_API_EVENTS.READ_ONLINE_USERS);
    
    ipcRenderer.once(FILE_API_EVENTS.READ_ONLINE_USERS_FINISHED,(_,value)=>{
      // console.log("preload getOnlineUsers cb",value);
      
      callback(value);
    });
  },

  /**
   * @param {Object} action
   * @param {"online"|"offline"} action.userType 
   * @param {"add"|"delete"|"update"|"clear"} action.operation
   * @param {any} [action.param] - 用户对象或uuid
   * @returns {number} - 操作状态码
   */
  updateUsersConfig(action){
    return ipcRenderer.invoke(FILE_API_EVENTS.UPDATE_USERS_CONFIG,action);
  },

  getOfflineUsers(callback){
    ipcRenderer.send(FILE_API_EVENTS.READ_OFFLINE_USERS);

    ipcRenderer.once(FILE_API_EVENTS.READ_OFFLINE_USERS_FINISHED,(_,value)=>{
      // console.log("preload getOfflineUsers cb",value);
      
      callback(value);
    });
  },
  
  /**
   * @param {"file" | "dir"} type 
   */
  chooseResource(type){

    return ipcRenderer.invoke(FILE_API_EVENTS.CHOOSE_RESCOURCE,type);
  },

  openResourceDialog(path){
    ipcRenderer.send(FILE_API_EVENTS.OPEN_RESOURCE_DIALOG,path);
  }
});

contextBridge.exposeInMainWorld("accountApi",{
  login(callback){
    ipcRenderer.send(ACCOUNT_API_EVENTS.LOGIN);

    ipcRenderer.once(ACCOUNT_API_EVENTS.LOGIN_FINISHED,(_,value)=>{
      callback(value);
    });
  },

  logout(user){
    ipcRenderer.invoke(ACCOUNT_API_EVENTS.LOGOUT,user);
  },

});

contextBridge.exposeInMainWorld("minecraftApi",{
  getInstalledVersions(){
    return ipcRenderer.invoke(MINECRAFT_API_EVENTS.GET_INSTALLED_VERSIONS);
  },

  /**
   * @param {boolean} online 
   * @param {any} versionInfo
   * @param {any} authorization
   * @param {string} versionName
   * @param {any} overrides
   */
  launchGame(online,versionInfo,authorization,versionName,overrides){
    // console.log(online,version,authorization,versionName);
    
    return ipcRenderer.invoke(MINECRAFT_API_EVENTS.LAUNCH_GAME,{online,versionInfo,authorization,versionName,overrides});
  },

});