const MAIN_API_EVENTS={
  MAIN_PROCESS_READY:"main-process-ready",

};

const WINDOW_API_EVENTS={
  MINIMIZE:"minimize",
  CLOSE:"close",
};

const FILE_API_EVENTS={
  READ_BASE_CONFIG:"read-base-config",
  READ_BASE_CONFIG_FINISHED:"read-base-config-finished",

  READ_ONLINE_USERS:"read-online-users",
  READ_ONLINE_USERS_FINISHED:"read-online-users-finished",

  READ_OFFLINE_USERS:"read-offline-users",
  READ_OFFLINE_USERS_FINISHED:"read-offline-users-finished",

  CHOOSE_RESCOURCE:"choose-resource",

  OPEN_RESOURCE_DIALOG:"open-resource-dialog",
};

const ACCOUNT_API_EVENTS={
  LOGIN:"login",
  LOGIN_FINISHED:"login-finished",
  
};


module.exports={
  MAIN_API_EVENTS,
  WINDOW_API_EVENTS,
  FILE_API_EVENTS,
  ACCOUNT_API_EVENTS,
}