import React, { useState } from 'react';
import { HomeOutlined, SettingOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';

import "./index.scss";

const tabs=[
  {
    label:"主页",
    icon:<HomeOutlined className='icon'/>,
    path:"/"
  },
  {
    label:"设置",
    icon:<SettingOutlined className='icon'/>,
    path:"/settings"
  },
];

export default function NavBar() {
  const [tabIndex,setTabIndex]=useState(0);

  const createTabs=()=>tabs.map((tab,index)=>{

    return (
      <NavLink key={index} to={tab.path}>
        <div 
        onClick={()=>setTabIndex(index)}
        className={`nav-tab ${tabIndex===index&&"active"}`}
        >
          {tab.icon}
          {tab.label}
        </div>
      </NavLink>
    );
  });

  return (
    <div className='nav-main'>
      {createTabs()}
    </div>
  )
}
