const log4js=require('log4js');
const path=require('path');
const {app}=require('electron');

log4js.configure({
  appenders:{
    file:{
      type:"file",
      filename:path.join(app.getPath("userData"),"log","app.log"),
      maxLogSize:5242880,
      backups:3,
      compress:true,
      daysToKeep:7,
    },
    console: {
      type: 'console'
    }
  },
  categories: {
    default: { appenders: ['file', 'console'], level: 'info' }
  }
});

const logger=log4js.getLogger();

module.exports=logger;