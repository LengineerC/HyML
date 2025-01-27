import React from 'react';
import {CloseOutlined, MinusOutlined} from '@ant-design/icons';
import NavBar from '../Navbar';

import "./index.scss";

export default function Header() {
  const handleMinimizeClick=()=>{
    window.windowApi.minimize();
  }

  const handleCloseClick=()=>{
    window.windowApi.close();
  }

  return (
    <div 
      style={{
        width:"auto",
        height:"auto",
        // position:"relative",
      }}
      // onMouseEnter={()=>setShowNavBar(true)}
      // onMouseLeave={()=>setShowNavBar(false)}
    >
      <div className='header-main'>
        <div className='logo'></div>

        <div className='center'></div>

        <div className='btns-container'>
          <div className='btn' onClick={handleMinimizeClick}>
            <MinusOutlined className='icon'/>
          </div>

          <div className='btn' onClick={handleCloseClick}>
            <CloseOutlined className='icon'/>
          </div>
        </div>
      </div>
      
      <NavBar />
    </div>
  )
}
