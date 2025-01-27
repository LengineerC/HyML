const {contextBridge,ipcRenderer}=require('electron');

contextBridge.exposeInMainWorld('windowApi',{
  minimize(){
    ipcRenderer.send("minimize");
  },
  close(){
    ipcRenderer.send("close");
  }
});