const {contextBridge,ipcRenderer}=require('electron');

const {
  MAIN_API_EVENTS,
  WINDOW_API_EVENTS,
  FILE_API_EVENTS,
  ACCOUNT_API_EVENTS,
}=require("./ipcEvents");

contextBridge.exposeInMainWorld("mainApi",{
  onMainProcessReady(callback){
    ipcRenderer.on(MAIN_API_EVENTS.MAIN_PROCESS_READY,()=>{
      // console.log("main-process-ready");
      callback();
    });
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
  getBaseConfig(callback){
    ipcRenderer.send(FILE_API_EVENTS.READ_BASE_CONFIG);

    ipcRenderer.once(FILE_API_EVENTS.READ_BASE_CONFIG_FINISHED,(_,value)=>{
      callback(value);
    });
  },

  getOnlineUsers(callback){
    ipcRenderer.send(FILE_API_EVENTS.READ_ONLINE_USERS);
    
    ipcRenderer.once(FILE_API_EVENTS.READ_ONLINE_USERS_FINISHED,(_,value)=>{
      // console.log("preload getOnlineUsers cb",value);
      
      callback(value);
    });
  },

  getOfflineUsers(callback){
    ipcRenderer.send(FILE_API_EVENTS.READ_OFFLINE_USERS);

    ipcRenderer.once(FILE_API_EVENTS.READ_OFFLINE_USERS_FINISHED,(_,value)=>{
      // console.log("preload getOfflineUsers cb",value);
      
      callback(value);
    });
  },
  
});

contextBridge.exposeInMainWorld("accountApi",{
  login(callback){
    ipcRenderer.send(ACCOUNT_API_EVENTS.LOGIN);

    ipcRenderer.once(ACCOUNT_API_EVENTS.LOGIN_FINISHED,(_,value)=>{
      callback(value);
    });
  },

});