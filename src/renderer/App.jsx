import React, { useEffect } from 'react';
import Header from './components/Header/index';
import { useRoutes } from 'react-router-dom';
import routes from './route/index';
import { useDispatch } from 'react-redux';
import {
  SAVE_BASE_CONFIG,
  SAVE_ONLINE_USERS,
  SAVE_OFFLINE_USERS,
} from "./redux/actions/constants";

import "./App.scss";

export default function App() {
  const elements=useRoutes(routes);
  const dispatch=useDispatch();

  useEffect(()=>{
    window.mainApi.onMainProcessReady(()=>{
      window.fileApi.getBaseConfig(value=>{
        dispatch({
          type:SAVE_BASE_CONFIG,
          payload:value
        });
        
      });

      window.fileApi.getOnlineUsers(value=>{
        // console.log("render App:",value);
        dispatch({
          type:SAVE_ONLINE_USERS,
          payload:value
        });

      });

      window.fileApi.getOfflineUsers(value=>{
        dispatch({
          type:SAVE_OFFLINE_USERS,
          payload:value
        });
      });
    });

  },[])

  return (
    <div className='app'>
      <Header />

      <div className='body'>
        {elements}
      </div>
    </div>
  )
}
