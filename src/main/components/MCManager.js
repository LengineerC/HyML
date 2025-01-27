const { Auth } = require("msmc");

class MCManager{

  /**
   * 异步获取mcToken
   * @returns {Promise<string> | null} -返回的mcToken
   */
  static getMcToken=async()=>{
    const authManager=new Auth("select_account");

    try {
      const xboxManager = await authManager.launch("electron");
      const minecraft = await xboxManager.getMinecraft(); 
      const mcToken = minecraft.mcToken; 

      return mcToken; 
    } catch (err) {
      console.error("Error fetching Minecraft token:", err);
      
      return null; 
    }
  }

}

module.exports=MCManager;