const fs = require('fs');
const path = require('path');
const { Auth } = require("msmc");
const logger = require("../log4js/logger");
const ConfigManager = require("./ConfigManager");
const { Client } = require('minecraft-launcher-core');
const { STATUS_CODE } = require('../utils/enum');
const FileManager = require('./FileManager');
const { v4:uuidv4 } = require('uuid');

class MCManager {
  static #FILENAME_VERION_INFO=".version_info.json";

  /**
   * 异步获取mc账号mclc配置，如果账号错误或者账号未购买Minecraft返回null
   * @returns {Promise<MclcUser> | null} 
   */
  static getOnlineMcAuth = async () => {
    const authManager = new Auth("select_account");

    try {
      const xboxManager = await authManager.launch("electron");
      const minecraft = await xboxManager.getMinecraft();
      const auth = minecraft.mclc();

      logger.info(`User: ${auth.name} logged in successfully`);
      return auth;
    } catch (err) {
      console.error("Error fetching minecraft authorization:", err);
      logger.error("Failed to login");

      return null;
    }
  }

  /**
   * @returns {Array<{ versionName:string, dirPath: string, minecraftJar: string, versionJson: string, versionInfo: any }>}
   */
  static getInstalledMcDirs = () => {
    let dirs = [];
    const savePath = ConfigManager.readBaseConfig().savePath ?? "";
    // const savePath = "F:/FrontEndProjects/electron-mc-launcher/core/.minecraft";
    const versionDirPath = path.join(savePath, "versions");
    // console.log("versionDirPath",versionDirPath);

    if (!fs.existsSync(savePath)) {
      return dirs;
    }

    for (const mcDirPath of fs.readdirSync(versionDirPath)) {
      const versionPath = path.join(versionDirPath, mcDirPath);

      const isDir = fs.statSync(versionPath).isDirectory();
      // console.log("isDir",versionPath,isDir);

      if (isDir) {
        let isMcVersionDir = false;
        let includeJar = false;
        let includeJson = false;
        let includeVersionInfo=false;

        let minecraftJar = "";
        let versionJson = "";
        let versionInfo={};
        const fileNames = fs.readdirSync(versionPath);

        for (const fileName of fileNames) {
          const filePath = path.join(versionPath, fileName);

          if (!includeJar && path.extname(fileName) === ".jar") {
            minecraftJar = filePath;
            includeJar = true;
            // continue;
          }

          if(fileName!==this.#FILENAME_VERION_INFO){
            if (!includeJson && path.extname(fileName) === ".json") {
              versionJson = filePath;
              includeJson = true;
              // continue;
            }
          }else{
            versionInfo=FileManager.readJSONSync(filePath);
            includeVersionInfo=true;
          }

          if (includeJar && includeJson && includeVersionInfo) {
            isMcVersionDir = true;
            break;
          }

        }

        if (!isMcVersionDir) continue;

        dirs.push({
          versionName:path.basename(versionPath),
          dirPath: versionPath,
          minecraftJar,
          versionJson,
          versionInfo,
        });
      }
    }

    return dirs;
  }

  /**
   * 创建版本信息
   * @param {string} dirPath 
   * @param {any} data 
   */
  static createVersionInfo=(dirPath,data)=>{
    const filePath=path.join(dirPath,".version_info.json");
    FileManager.writeJSONSync(filePath,data);
  }

  static readVersionInfo=dirPath=>{
    const filePath=path.join(dirPath,this.#FILENAME_VERION_INFO);
    let versionInfo={};

    try{
      versionInfo=FileManager.readJSONSync(filePath);

    }catch(err){
      logger.error(`Failed to read .version_info.json in ${dirPath}`,err.message);

    }finally{
      return versionInfo;
    }
  }

  /**
   * 启动游戏异步
   * @param {boolean} online 
   * @param {any} versionInfo
   * @param {any} authorization
   * @param {string} versionName
   * @param {any} overrides
   */
  static launchGame=async(online,versionInfo,authorization,versionName,overrides={})=>{
    try{
      const launcher=new Client();
      const {maxMem,savePath}=ConfigManager.readBaseConfig();
      const {version}=versionInfo;
      let latestPlayedVersionId="";
      const directory=path.join(savePath,"versions",versionName);

      if(!fs.existsSync(directory)){
        latestPlayedVersionId=uuidv4();

        this.createVersionInfo(directory,{
          version,
          versionId:latestPlayedVersionId,
        });

      }else{
        latestPlayedVersionId=versionInfo.versionId;
      }

      let baseConfig=ConfigManager.readBaseConfig();
      ConfigManager.writeBaseConfig({
        ...baseConfig,
        latestPlayedVersionId
      });

      let options={
        memory:{
          min:"1G",
          max:maxMem+"G"
        },
        root:savePath,
        version,
        overrides:{
          directory,
        }
      };

      const {minecraftJar=null,versionJson=null}=overrides;
      if(minecraftJar){
        options.overrides.minecraftJar=minecraftJar;
      }
      if(versionJson){
        options.overrides.versionJson=versionJson;
      }

      if(online) options.authorization=authorization;
      else{
        // TODO: add dealing with offline authorization

      }

      logger.info("Launching game...");
      await launcher.launch(options);

      // launcher.on("progress",(e) => console.log(e));
      launcher.on('debug', (e) => console.log(e));
      launcher.on('data', (e) => console.log(e));
      // launcher.on('close', (e) => console.log(e));
      // launcher.on('download', (e) => console.log(e));
      // launcher.on('download-status', (e) => console.log(e));

      return STATUS_CODE.SUCCESS;
    }catch(err){
      logger.error("Failed to launch game:",err.message);
      return STATUS_CODE.ERROR;
    }

  }

}

module.exports = MCManager;