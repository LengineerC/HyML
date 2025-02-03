import React, { useEffect, useState } from 'react';
import Card from '../../components/Card';
import { ConfigProvider, message } from 'antd';
import { 
  CloseOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { getMinecraftVersions } from '../../services/minecraftService';
import mcVersionsJson from './mcversions';
import Account from './Account/index';
import { SELECTED_LOCATION } from '../../utils/enum';
import { useNavigate } from 'react-router-dom';
import { saveInstalledMcVersions, saveMcVersions } from '../../redux/slices/minecraftSlice';

import "./index.scss";

import mincraftIcon from "../../assets/images/minecraft.svg";

export default function Home() {
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const { mcVersions, installedMcVersions, currentMcOptions, online } = useSelector(state => state.minecraft);
  const {baseConfig}=useSelector(s=>s.config);
  const {onlineUsers}=useSelector(s=>s.user);
  const [messageApi,contextHolder]=message.useMessage();

  const [showVersionSelector,setShowVersionSelector]=useState(false);
  const [selectedLocation,setSelectedLocation]=useState(SELECTED_LOCATION.INSTALLED);

  const [startBtnAvailable,setStartBtnAvailable]=useState(true);

  useEffect(()=>{
    console.log("Loaded Home");
    
    // if(mcVersions.length<=0){
    //   getMinecraftVersions().then(mcVersions=>{
    //     let formatedMcVersions=mcVersions.map(version=>({
    //       ...version,
    //       dateModified:version.dateModified.toISOString(),
    //     }));
    //     dispatch(saveMcVersions(formatedMcVersions));
      
    //   }).catch(err=>{
    //     console.error(err);
      
    //     messageApi.error("获取正式版本列表失败");
    //   });

    // }
          
    if(installedMcVersions.length<=0){
      window.minecraftApi.getInstalledVersions()
        .then(versions=>{
          // console.log(versions);
          
          dispatch(saveInstalledMcVersions(versions));
        }).catch(err=>{
          console.error("Failed to fetch installed versions:",err);
          
        });
    }


  },[]);

  const handleSelectedVersion=version=>{
    setShowVersionSelector(false);
    navigate("/version-options",{
      state:{
        param:version,
        type:SELECTED_LOCATION.DOWNLOAD
      }
    });
    // console.log(version);
  }

  const createVersions=()=>{
    if(selectedLocation===SELECTED_LOCATION.DOWNLOAD){
      // if(mcVersions&&mcVersions.length>0){
        // console.log("mcVersions",mcVersions);
        
        return mcVersionsJson.map((version,index)=>{
          const dateString=version.dateModified.substring(0,10);
  
        // return mcVersions.map((version,index)=>{
        //   const date=new Date(version.dateModified);
        //   const dateString=date.toISOString().substring(0,10);
    
          return(
            <div 
            className='version' 
            key={index}
            onClick={()=>handleSelectedVersion(version)}
            >
              <div className='col-1'>
                <div className='icon'>
                  <img src={mincraftIcon} alt="" />
                </div>
    
                <div className='version-label'>
                  {version.versionString}
                </div>
              </div>
    
              <div className='time-container'>
                {dateString}
              </div>
            </div>
          );
        });
      // }

    }else{

    }

  }

  const startGame=async()=>{
    if(online){
      // console.log("currentMcOptions",currentMcOptions);
      const {version,versionName}=currentMcOptions;
      const authorization=onlineUsers.filter(user=>user.uuid===baseConfig.currentOnlineUser)[0] ?? null;
      
      if(authorization){
        const code=await window.minecraftApi.launchGame(online,version,authorization,versionName);
      }

    }
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#409EFF",
          colorPrimaryActive: "#2786e6",
        },

      }}
    >
      {contextHolder}
      <div className='home-main'>
        <div className={`version-selector-container ${!showVersionSelector && "fade-out"}`}>
          <div className="version-selector-main">
            <div className='header'>
              {/* <div className='icon'>
                <img src={mincraftIcon} alt="" />
              </div> */}

              <div className='title'>
                选择版本
              </div>

              <div className='location-chooser'>
                <div 
                className={`location-btn ${selectedLocation===0&&"selected"}`}
                onClick={()=>setSelectedLocation(SELECTED_LOCATION.INSTALLED)}
                >
                  已安装
                </div>

                <div 
                className={`location-btn ${selectedLocation===1&&"selected"}`}
                onClick={()=>setSelectedLocation(SELECTED_LOCATION.DOWNLOAD)}
                >
                  下载
                </div>
              </div>

              <CloseOutlined 
                className='close-btn'
                onClick={()=>setShowVersionSelector(false)}
              />
            </div>

            <hr />

            <div className='version-body'>
              {createVersions()}
            </div>
          </div>
        </div>

        <div className='row-1'>
          <Account />

          <Card>
            <div className='version-container'>
              <div className='row'>
                <div 
                className='btn'
                onClick={()=>setShowVersionSelector(true)}
                >
                  版本选择
                </div>

                <div className='btn'>
                  版本设置
                </div>
              </div>

              <div className='row'>
                <div 
                  className={startBtnAvailable?"btn-start":"btn-start-disabled"}
                  onClick={
                    startBtnAvailable?startGame:()=>{}
                  }
                >
                  <div className='label'>
                    {startBtnAvailable?"启动游戏":"游戏启动中..."}
                  </div>

                  <div className='info'>
                    {currentMcOptions.versionName || "未选择版本"}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className='row-2'>
          <Card>
            <div className='log-container'>

            </div>
          </Card>
        </div>
      </div>
    </ConfigProvider>
  )
}
