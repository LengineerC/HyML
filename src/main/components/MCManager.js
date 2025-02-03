const fs = require('fs');
const path = require('path');
const { Auth } = require("msmc");
const logger = require("../log4js/logger");
const ConfigManager = require("./ConfigManager");
const { Client } = require('minecraft-launcher-core');

class MCManager {

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
   * @returns {Array<{ dirPath: string, minecraftJar: string, versionJson: string }>}
   */
  static getInstalledMcDirs = () => {
    let dirs = [];
    // const savePath = ConfigManager.readBaseConfig().savePath ?? "";
    const savePath = "F:/FrontEndProjects/electron-mc-launcher/core/.minecraft";
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

        let minecraftJar = "";
        let versionJson = "";
        const fileNames = fs.readdirSync(versionPath);

        for (const fileName of fileNames) {
          const filePath = path.join(versionPath, fileName);

          if (!includeJar && path.extname(fileName) === ".jar") {
            minecraftJar = filePath;
            includeJar = true;
            // continue;
          }
          if (!includeJson && path.extname(fileName) === ".json") {
            versionJson = filePath;
            includeJson = true;
            // continue;
          }

          if (includeJar && includeJson) {
            isMcVersionDir = true;
            break;
          }
        }

        if (!isMcVersionDir) continue;

        dirs.push({
          versionName:path.basename(versionPath),
          dirPath: versionPath,
          minecraftJar,
          versionJson
        });
      }
    }

    return dirs;
  }

  /**
   * 启动游戏
   * @param {boolean} online 
   * @param {string} version.number
   * @param {"release" | "snapshot"} version.type
   * @param {any} authorization
   * @param {string} versionName
   */
  static launchGame=(online,version,authorization,versionName)=>{
    const launcher=new Client();
    const {maxMem,savePath}=ConfigManager.readBaseConfig();
    const directory=path.join(savePath,"versions",versionName);

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

    if(online) options.authorization=authorization;
    else{
      // TODO: add dealing with offline authorization

    }

    try{
      // console.log("Launching...",options);
      
      launcher.launch(options);

      // launcher.on("progress",(e) => console.log(e));
      launcher.on('debug', (e) => console.log(e));
      launcher.on('data', (e) => console.log(e));
      // launcher.on('close', (e) => console.log(e));
      // launcher.on('download', (e) => console.log(e));
      // launcher.on('download-status', (e) => console.log(e));

    }catch(err){
      logger.error("Failed to launch game:",err.message);
    }

  }

}

module.exports = MCManager;