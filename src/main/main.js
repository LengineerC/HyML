const path=require('path');
const os=require("os");
const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const {
  MAIN_API_EVENTS,
  WINDOW_API_EVENTS,
  FILE_API_EVENTS,
  ACCOUNT_API_EVENTS,
  OS_API_EVENTS,
  MINECRAFT_API_EVENTS,
}=require("./ipcEvents");
const logger=require("./log4js/logger");
const ConfigManager = require('./components/ConfigManager');
const MCManager = require('./components/MCManager');
const { STATUS_CODE } = require('./utils/enum');

/**
 * @type {BrowserWindow | null}
 */
let mainWindow=null;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1000,
    maxWidth:1000,
    height: 600,
    maxHeight:600,
    frame:false,
    resizable:false,
    maximizable:false,
    fullscreenable:false,
    webPreferences: {
      preload:path.join(__dirname,"preload.js"),
      nodeIntegration: true,
    },
  });

  if(process.env.NODE_ENV === 'development'){
    win.loadURL("http://localhost:8000/#/");
    win.webContents.openDevTools();
  }else{
    win.webContents.openDevTools();

    const indexPath=path.join(__dirname,"./dist/renderer/index.html");
    
    win.loadFile(indexPath);

    // avoid production mode open devTool
    win.webContents.on('before-input-event', (event, input) => {
      if (input.key === 'F12' || (input.control && input.shift && input.key === 'I')) {
        event.preventDefault();
      }
    });
  }

  mainWindow=win;
  mainWindow.webContents.once("dom-ready",()=>{
    mainWindow.webContents.send(MAIN_API_EVENTS.MAIN_PROCESS_READY);
  });
  logger.info("MainWindow created");
}

const readBaseConfig=()=>{
  const baseConfig=ConfigManager.readBaseConfig();

  mainWindow.webContents.send(FILE_API_EVENTS.READ_BASE_CONFIG_FINISHED,baseConfig);
}

const readOnlineUsersConfig=()=>{
  const onlineUsers=ConfigManager.readUsers("online");

  mainWindow.webContents.send(FILE_API_EVENTS.READ_ONLINE_USERS_FINISHED,onlineUsers);
}
const readOfflineUsersConfig=()=>{
  const offlineUsers=ConfigManager.readUsers("offline");

  mainWindow.webContents.send(FILE_API_EVENTS.READ_OFFLINE_USERS_FINISHED,offlineUsers);
}

const handleLogin=async()=>{
  logger.info("Start to login");
  const user=await MCManager.getOnlineMcAuth();
  // console.log(user);
  
  if(user){
    let baseConfig=ConfigManager.readBaseConfig();
    baseConfig.currentOnlineUser=user.uuid;
    
    ConfigManager.writeBaseConfig(baseConfig);

    let onlineUsers=ConfigManager.readUsers("online");
    if(onlineUsers.findIndex(onlineUser=>onlineUser.uuid===user.uuid)===-1){
      ConfigManager.editUsersConfig("online","add",user);
    }else{
      ConfigManager.editUsersConfig("online","update",user);
    }

    mainWindow.webContents.send(ACCOUNT_API_EVENTS.LOGIN_FINISHED,STATUS_CODE.SUCCESS)
  }else{
    mainWindow.webContents.send(ACCOUNT_API_EVENTS.LOGIN_FINISHED,STATUS_CODE.ERROR);
  }
}

/**
 * @param {"file" | "dir"} type 
 */
const handleChooseResouce=async(type)=>{
  const resourceType=type==="file"?"openFile":"openDirectory";
  console.log("handleChooseResouce",resourceType);
  
  const resourcePath=await dialog.showOpenDialog(mainWindow,{
    properties:[resourceType]
  }).then(result=>{
    if(!result.canceled){
      savePath=result.filePaths[0];

      let baseConfig=ConfigManager.readBaseConfig();
      ConfigManager.writeBaseConfig({
        ...baseConfig,
        savePath
      });

      return savePath;
    }
    
  }).catch(err=>{
    console.error("Choose resource error:",err);
  });

  return resourcePath;
}

const handleOpenResource=path=>{
  shell.openPath(path);
}

const handleUpdateBaseConfig=baseConfig=>{
  try{
    ConfigManager.writeBaseConfig(baseConfig);

    return STATUS_CODE.SUCCESS;
  }catch{
    console.error("Failed to update base.json",err);
    
    return STATUS_CODE.ERROR;
  }
}

const getTotalMemory=()=>{
  return os.totalmem();
}

/**
 * @param {Object} action
 * @param {"online"|"offline"} action.userType 
 * @param {"add"|"delete"|"update"|"clear"} action.operation
 * @param {any} [action.param] - 用户对象或uuid
 * @returns {number} - 操作状态码
 */
const updateUsersConfig=action=>{
  try{
    const {userType,operation,param}=action
    ConfigManager.editUsersConfig(userType,operation,param);
    return STATUS_CODE.SUCCESS;
  }catch(err){
    console.error("updateUsersConfig",err);
    return STATUS_CODE.ERROR;    
  }
}

const handleLoginOut=user=>{
  ConfigManager.editUsersConfig("online","delete",user);
  let baseConfig=ConfigManager.readBaseConfig();
  ConfigManager.writeBaseConfig({
    ...baseConfig,
    currentOnlineUser:null,
  });
}

const getInstalledVersions=()=>{
  
  return MCManager.getInstalledMcDirs();
}

app.whenReady().then(() => {
  createWindow();

  // Listen OS events
  ipcMain.handle(OS_API_EVENTS.GET_TOTAL_MEMORY,getTotalMemory);

  // Listen window event
  ipcMain.on(WINDOW_API_EVENTS.MINIMIZE,()=>{
    mainWindow.minimize();
  });

  ipcMain.on(WINDOW_API_EVENTS.CLOSE,()=>{
    mainWindow.close();
  });

  // Init and read configs
  ipcMain.on(FILE_API_EVENTS.READ_BASE_CONFIG,readBaseConfig);
  ipcMain.on(FILE_API_EVENTS.READ_ONLINE_USERS,readOnlineUsersConfig);
  ipcMain.on(FILE_API_EVENTS.READ_OFFLINE_USERS,readOfflineUsersConfig);
  ipcMain.handle(FILE_API_EVENTS.UPDATE_BASE_CONFIG,(_,baseConfig)=>handleUpdateBaseConfig(baseConfig));
  ipcMain.handle(FILE_API_EVENTS.UPDATE_USERS_CONFIG,(_,action)=>updateUsersConfig(action));

  ipcMain.handle(FILE_API_EVENTS.CHOOSE_RESCOURCE,(_,type)=>handleChooseResouce(type));
  ipcMain.on(FILE_API_EVENTS.OPEN_RESOURCE_DIALOG,(_,path)=>handleOpenResource(path));
  
  // Listen account events
  ipcMain.on(ACCOUNT_API_EVENTS.LOGIN,handleLogin);
  ipcMain.handle(ACCOUNT_API_EVENTS.LOGOUT,(_,user)=>handleLoginOut(user));

  // Listen minecraft events
  ipcMain.handle(MINECRAFT_API_EVENTS.GET_INSTALLED_VERSIONS,getInstalledVersions);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  })
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
  logger.info("App closed");
});