const fs = require('fs');
const { Auth } = require("msmc");
const logger = require("../log4js/logger");
const ConfigManager = require("./ConfigManager");
const path = require('path');

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

}

module.exports = MCManager;