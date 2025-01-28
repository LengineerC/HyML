import React, { useEffect } from 'react';
import Header from './components/Header/index';
import { useRoutes } from 'react-router-dom';
import routes from './route/index';

import "./App.scss";

export default function App() {
  const elements=useRoutes(routes);

  useEffect(()=>{
    window.mainApi.onMainProcessReady(()=>{
      window.fileApi.getOnlineUsers(value=>{
        console.log("render App:",value);
        
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
