const fs=require('fs');
const path=require('path');
const {app}=require('electron');
const FileManager=require("./FileManager");
const logger = require('../log4js/logger');

/**
 * 暂时写为分开的重复代码后续可能加入对应的特殊处理
 */
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
      currentOnlineUser:null,
      currentOfflineUser:null,
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
    }
  }

  /**
   * 同步读取正版用户账号配置
   * @returns {any[]}
   */
  static readOnlineUsers=()=>{
    let onlineUsers=[];

    if(!fs.existsSync(this.onlineUserConfigPath)){
      FileManager.writeJSONSync(this.onlineUserConfigPath,[]);
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
   * 同步修改online_user.json
   * @param {"add" | "delete" | "update" | "clear"} operation 
   * @param {Object} user 
   */
  static editOnlineUsersConfig=(operation,user)=>{
    let currentOnlineUsers=this.readOnlineUsers();

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
    }
  }

  /**
   * 同步读取离线用户账号配置
   * @returns {any[]}
   */
  static readOfflineUsers=()=>{
    let offlineUsers=[];

    if(!fs.existsSync(this.offlineUserConfigPath)){
      FileManager.writeJSONSync(this.offlineUserConfigPath,[]);
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

  /**
   * 同步修改offline_users.json
   * @param {"add" | "delete" | "update" | "clear"} operation 
   * @param {Object} user 
   */
  static editOfflineUsersConfig=(operation,user)=>{
    let currentOfflineUsers=this.readOfflineUsers();

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
    }
  }

}

module.exports=ConfigManager;