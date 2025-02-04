const fs=require('fs');
const path=require('path');
const {app}=require('electron');
const FileManager=require("./FileManager");
const logger = require('../log4js/logger');

class ConfigManager{
  static basePath=path.resolve(app.getPath("userData"),"config");
  static baseConfigPath=path.resolve(this.basePath,"base.json");
  static onlineUserConfigPath=path.resolve(this.basePath,"online_user.json");
  static offlineUserConfigPath=path.resolve(this.basePath,"offline_user.json");

  /**
   * 同步读取基础配置
   * @returns {Object}
   */
  static readBaseConfig=()=>{
    let baseConfig={
      savePath:null,
      currentOnlineUser:null,
      currentOfflineUser:null,
      latestPlayedVersionId:null,
      maxMem:4,
    }

    if(!fs.existsSync(this.baseConfigPath)){
      FileManager.writeJSONSync(this.baseConfigPath,baseConfig);
      return baseConfig;
    }

    try{
      baseConfig=JSON.parse(fs.readFileSync(this.baseConfigPath,{encoding:"utf8"}));

      return baseConfig;
    }catch(err){
      console.log("Read base config error:",err);
      return baseConfig;
    }
  }

  /**
   * 写入base.json
   * @param {Object} baseConfig 
   */
  static writeBaseConfig=(baseConfig)=>{
    try{
      FileManager.writeJSONSync(this.baseConfigPath,baseConfig);

    }catch(err){
      logger.error("Failed to write base.json", err.message);
      throw err;
    }
  }

  /**
   * 同步读取账号列表
   * @param {"online" | "offline"} userType 
   * @returns {any[]}
   */
  static readUsers=userType=>{
    let users=[];

    if(userType==="online"){
      if(!fs.existsSync(this.onlineUserConfigPath)){
        FileManager.writeJSONSync(this.onlineUserConfigPath,[]);
        return users;
      }
  
      try{
        
        users=JSON.parse(fs.readFileSync(this.onlineUserConfigPath,{encoding:"utf8"}));
  
        return users;
      }catch(err){
        logger.error("Read online users config error:",err.message);
        return users;
      }

    }else{
      if(!fs.existsSync(this.offlineUserConfigPath)){
        FileManager.writeJSONSync(this.offlineUserConfigPath,[]);
        return users;
      }
  
      try{
        users=JSON.parse(fs.readFileSync(this.offlineUserConfigPath,{encoding:"utf8"}));
  
        return users;
      }catch(err){
        logger.error("Read offline users config error:",err.message);
        return users;
      }

    }
  }

  /**
   * 
   * @param {"online" | "offline"} userType 
   * @param {"add" | "delete" | "update" | "clear"} operation 
   * @param {Object} user 
   */
  static editUsersConfig=(userType,operation,user)=>{
    if(userType==="online"){
      let currentOnlineUsers=this.readUsers("online");

      try{
        switch(operation){
          case "add":{
            currentOnlineUsers.push(user);
            FileManager.writeJSONSync(this.onlineUserConfigPath,currentOnlineUsers);
            
            break;
          }
    
          case "delete":{
            const newOnlineUsers=currentOnlineUsers.filter(onlineUser=>user.uuid!==onlineUser.uuid);
            FileManager.writeJSONSync(this.onlineUserConfigPath,newOnlineUsers);
    
            break;
          }
    
          case "update":{
            const index=currentOnlineUsers.findIndex(onlineUser=>onlineUser.uuid===user.uuid);
            currentOnlineUsers[index]=user;
            FileManager.writeJSONSync(this.onlineUserConfigPath,currentOnlineUsers);
    
            break;
          }
    
          case "clear":{
            FileManager.writeJSONSync(this.onlineUserConfigPath,[]);
  
            break;
          }
        }
  
      }catch(err){
        logger.error("Failed to edit online_users.json",err.message);
        throw err;
      }

    }else if(userType==="offline"){
      let currentOfflineUsers=this.readUsers("offline");

      try{
        switch(operation){
          case "add":{
            currentOfflineUsers.push(user);
            FileManager.writeJSONSync(this.offlineUserConfigPath,currentOfflineUsers);
            
            break;
          }
    
          case "delete":{
            const newOfflineUsers=currentOfflineUsers.filter(offlineUser=>user.uuid!==offlineUser.uuid);
            FileManager.writeJSONSync(this.offlineUserConfigPath,newOfflineUsers);
    
            break;
          }
    
          case "update":{
            const index=currentOfflineUsers.findIndex(offlineUser=>offlineUser.uuid===user.uuid);
            currentOfflineUsers[index]=user;
            FileManager.writeJSONSync(this.offlineUserConfigPath,currentOfflineUsers);
    
            break;
          }
    
          case "clear":{
            FileManager.writeJSONSync(this.offlineUserConfigPath,[]);
            
            break;
          }
        }
  
      }catch(err){
        logger.error("Failed to edit offline_users.json",err.message);
        throw err;
      }

    }
  }

}

module.exports=ConfigManager;