const path=require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
const logger=require("./log4js/logger");
const ConfigManager = require('./components/ConfigManager');
// const MCManager = require('./components/MCManager');

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
    const indexPath=path.join(__dirname,"./dist/renderer/index.html");
    
    win.loadFile(indexPath);

    // avoid production mode open devTool
    win.webContents.on('before-input-event', (event, input) => {
      if (input.key === 'F12' || (input.control && input.shift && input.key === 'I')) {
        event.preventDefault()
      }
    });
  }

  mainWindow=win;
  mainWindow.webContents.once("dom-ready",()=>{
    mainWindow.webContents.send("main-process-ready");
  });
  logger.info("MainWindow created");
}


const startListenWindowApi=()=>{
  ipcMain.on('minimize',()=>{
    mainWindow.minimize();
  });

  ipcMain.on("close",()=>{
    mainWindow.close();
  });
}


const readOnlineUsersConfig=()=>{
  const onlineUsers=ConfigManager.readOnlineUsers();

  mainWindow.webContents.send("read-online-users-finished",onlineUsers);
}

app.whenReady().then(async() => {
  createWindow();
  // Start listeners
  startListenWindowApi();

  ipcMain.on("read-online-users",readOnlineUsersConfig);

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