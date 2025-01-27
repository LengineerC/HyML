import React from 'react';
import Header from './components/Header/index';
import { useRoutes } from 'react-router-dom';
import routes from './route/index';

import "./App.scss";
import { ConfigProvider } from 'antd';

export default function App() {
  const elements=useRoutes(routes);

  return (
    <div className='app'>
      <Header />

      <ConfigProvider
        theme={{
          token:{
            colorPrimary:"#409EFF",
            colorPrimaryActive:"#2786e6"
          }
        }}
      >
        <div className='body'>
          {elements}
        </div>
      </ConfigProvider>
    </div>
  )
}
