import React, { useEffect } from 'react';
import Header from './components/Header/index';
import { useRoutes } from 'react-router-dom';
import routes from './route/index';
import { useDispatch } from 'react-redux';
import { saveTotalMemory } from './redux/slices/osInfoSlice';
import { saveBaseConfig } from './redux/slices/configSlice';
import { saveOfflineUsers, saveOnlineUsers } from './redux/slices/userSlice';
import { AliveScope } from 'react-activation';

import "./App.scss";


export default function App() {
  const elements=useRoutes(routes);
  const dispatch=useDispatch();

  useEffect(()=>{
    window.mainApi.onMainProcessReady(async()=>{
      const totalMemory=await window.osApi.getTotalMemory();
      dispatch(saveTotalMemory(totalMemory));
      
      window.fileApi.getBaseConfig()
        .then(value=>{
          dispatch(saveBaseConfig(value));
        }).catch(err=>{
          console.error("Failed to get base config",err);
        })

      window.fileApi.getOnlineUsers(value=>{
        dispatch(saveOnlineUsers(value));

      });

      window.fileApi.getOfflineUsers(value=>{

        dispatch(saveOfflineUsers(value));
      });
    });

  },[])

  return (
    <div className='app'>
      <Header />

      <div className='body'>
        <AliveScope>
          {elements}
        </AliveScope>
      </div>
    </div>
  )
}
