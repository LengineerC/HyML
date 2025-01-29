const { Auth } = require("msmc");
const logger = require("../log4js/logger");

class MCManager{

  /**
   * 异步获取mc账号mclc配置，如果账号错误或者账号未购买Minecraft返回null
   * @returns {Promise<MclcUser> | null} 
   */
  static getOnlineMcAuth=async()=>{
    const authManager=new Auth("select_account");

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

}

module.exports=MCManager;