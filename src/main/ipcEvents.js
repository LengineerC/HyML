const MAIN_API_EVENTS={
  MAIN_PROCESS_READY:"main-process-ready",

};

const OS_API_EVENTS={
  GET_TOTAL_MEMORY:"get-total-memory",
};

const WINDOW_API_EVENTS={
  MINIMIZE:"minimize",
  CLOSE:"close",
};

const FILE_API_EVENTS={
  READ_BASE_CONFIG:"read-base-config",
  UPDATE_BASE_CONFIG:"update-base-config",

  READ_ONLINE_USERS:"read-online-users",
  READ_ONLINE_USERS_FINISHED:"read-online-users-finished",
  
  READ_OFFLINE_USERS:"read-offline-users",
  READ_OFFLINE_USERS_FINISHED:"read-offline-users-finished",
  
  UPDATE_USERS_CONFIG:"update-online-user-config",

  CHOOSE_RESCOURCE:"choose-resource",

  OPEN_RESOURCE_DIALOG:"open-resource-dialog",
};

const ACCOUNT_API_EVENTS={
  LOGIN:"login",
  LOGIN_FINISHED:"login-finished",
  LOGOUT:"logout",
};

const MINECRAFT_API_EVENTS={
  GET_INSTALLED_VERSIONS:"get-installed-versions",

  LAUNCH_GAME:"launch-game",
};

module.exports={
  MAIN_API_EVENTS,
  OS_API_EVENTS,
  WINDOW_API_EVENTS,
  FILE_API_EVENTS,
  ACCOUNT_API_EVENTS,
  MINECRAFT_API_EVENTS,
}