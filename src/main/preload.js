const {contextBridge,ipcRenderer}=require('electron');

contextBridge.exposeInMainWorld("mainApi",{
  onMainProcessReady(callback){
    ipcRenderer.on("main-process-ready",()=>{
      // console.log("main-process-ready");
      callback();
    });
  }
});

contextBridge.exposeInMainWorld('windowApi',{
  minimize(){
    ipcRenderer.send("minimize");
  },
  close(){
    ipcRenderer.send("close");
  }
});

contextBridge.exposeInMainWorld("fileApi",{
  getOnlineUsers(callback){
    ipcRenderer.send("read-online-users");
    
    ipcRenderer.on("read-online-users-finished",(_,value)=>{
      // console.log("preload getOnlineUsers cb");
      
      callback(value);
    });
  },
});