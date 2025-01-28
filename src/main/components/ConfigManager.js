const fs=require('fs');
const path=require('path');
const {app}=require('electron');
const FileManager=require("./FileManager");

class ConfigManager{
  static basePath=path.resolve(app.getPath("userData"),"config");
  static onlineUserConfigPath=path.resolve(this.basePath,"online_user.json");
  static offlineUserConfigPath=path.resolve(this.basePath,"offline_user.json");

  /**
   * 同步读取正版用户账号配置
   * @returns {any[]}
   */
  static readOnlineUsers=()=>{
    let onlineUsers=[];

    if(!fs.existsSync(this.onlineUserConfigPath)){
      FileManager.writeJSON(this.onlineUserConfigPath,[]);
      return onlineUsers;
    }

    try{
      onlineUsers=JSON.parse(fs.readFileSync(this.onlineUserConfigPath,{encoding:"utf8"}));

      return onlineUsers;
    }catch(err){
      console.log("Read online users config error:",err);
      return onlineUsers;
    }
  }

  /**
   * 同步读取离线用户账号配置
   * @returns {any[]}
   */
  static readOnlineUsers=()=>{
    let offlineUsers=[];

    if(!fs.existsSync(this.offlineUserConfigPath)){
      FileManager.writeJSON(this.offlineUserConfigPath,[]);
      return offlineUsers;
    }

    try{
      offlineUsers=JSON.parse(fs.readFileSync(this.offlineUserConfigPath,{encoding:"utf8"}));

      return offlineUsers;
    }catch(err){
      console.log("Read offline users config error:",err);
      return offlineUsers;
    }
  }
}

module.exports=ConfigManager;