const fs=require('fs');
const path = require('path');
const {STATUS_CODE}=require("../utils/enum");

class FileManager{
  /**
   * 同步创建文件夹
   * @param {string} path 
   * @param {boolean} [recursive=true] - 默认为true
   * @returns {void}
   */
  static mkDirSync=(path,recursive=true)=>{
    fs.mkdirSync(path,{recursive});
  }

   /**
   * 使用流来保存文件
   * @param {string} filePath 
   * @param {Stream} stream 
   * @param {(code:number)=>void} callback
   */
   static writeFileWithStream=(filePath, stream, callback)=>{
    const dirPath=path.dirname(filePath);
    if(!fs.existsSync(dirPath)){
      this.mkDirSync(dirPath);
    }

    const writeStream=fs.createWriteStream(filePath);
    stream.pipe(writeStream);

    writeStream.on("finish", ()=>{
      console.log("File saved in: ",filePath);
      
      if(typeof callback==="function"){
        callback(STATUS_CODE.SUCCESS);
      }
    });

    writeStream.on("error", err=>{
      console.error("Failed to save file. ", err);
      
      if(typeof callback==="function"){
        callback(STATUS_CODE.ERROR);
      }

      throw err;
    });
  }

  /**
   * 同步写入JSON文件
   * @param {string} filePath 
   * @param {Object} data 
   * @param {(code:number)=>void} callback
   */
  static writeJSONSync=(filePath,data,callback)=>{
    const dirPath=path.dirname(filePath);
    if(!fs.existsSync(dirPath)){
      this.mkDirSync(dirPath);
    }

    try{
      const jsonString=JSON.stringify(data);
      fs.writeFileSync(filePath,jsonString);;
      if(typeof callback==="function") callback(STATUS_CODE.SUCCESS);
    }catch(err){
      console.error(`Error writing file: ${filePath}`,err);
      
      if(typeof callback==="function") callback(STATUS_CODE.ERROR);
      throw err;
    }
  }

  /**
   * 同步读取JSON文件
   * @param {string} filePath 
   */
  static readJSONSync=(filePath)=>{
    try {
      const jsonString=fs.readFileSync(filePath,{encoding:"utf8"});
      return JSON.parse(jsonString);

    } catch (err) {
      console.error(`Failed to read JSON file: ${filePath}`,err);
      throw err;
    }
  }
}

module.exports=FileManager;