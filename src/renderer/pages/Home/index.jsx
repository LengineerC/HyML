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
import { SELECTED_LOCATION, STATUS_CODE } from '../../utils/enum';
import { useNavigate } from 'react-router-dom';
import { saveCurrentMcOptions, saveInstalledMcVersions, saveMcVersions } from '../../redux/slices/minecraftSlice';

import "./index.scss";

import mincraftIcon from "../../assets/images/minecraft.svg";
import grassBlockIcon from "../../assets/images/grass_block.svg";
import { saveBaseConfig } from '../../redux/slices/configSlice';

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
      getInstalledVersions();
    }


  },[]);

  useEffect(()=>{
    const setLatestPlayedVersion=()=>{
      const latestPlayedIndex=installedMcVersions.findIndex(version=>version.versionInfo.versionId===baseConfig.latestPlayedVersionId);
      
      if(latestPlayedIndex!==-1){
        // console.log("latestPlayedIndex",latestPlayedIndex);
        
        dispatch(saveCurrentMcOptions(installedMcVersions[latestPlayedIndex]));
      }
    }

    if(Object.keys(baseConfig).length>0 && installedMcVersions.length>0){
      setLatestPlayedVersion();
    }

  },[baseConfig,installedMcVersions])


  const getInstalledVersions=async()=>{
    const versions=await window.minecraftApi.getInstalledVersions();
    dispatch(saveInstalledMcVersions(versions));
  }

  const getBaseConfig=async()=>{
    const baseConfig=await window.fileApi.getBaseConfig();
    dispatch(saveBaseConfig(baseConfig));
  }

  const handleSelectedVersion=(version,type)=>{
    setShowVersionSelector(false);

    if(type===SELECTED_LOCATION.DOWNLOAD){
      navigate("/version-options",{
        state:{
          param:version,
          type:SELECTED_LOCATION.DOWNLOAD
        }
      });
    }else if(type===SELECTED_LOCATION.INSTALLED){
      dispatch(saveCurrentMcOptions(version));
    }
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
            onClick={()=>handleSelectedVersion(version,SELECTED_LOCATION.DOWNLOAD)}
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
      // console.log("installedMcVersions",installedMcVersions);
      
      return installedMcVersions.map((version,index)=>{

        return(
          <div
            className='version'
            key={"installed"+index}
            onClick={()=>handleSelectedVersion(version,SELECTED_LOCATION.INSTALLED)}
          >
            <div className='col-1'>
              <div className='icon'>
                <img src={grassBlockIcon} alt="" />
              </div>
  
              <div className='version-label'>
                {version.versionName}
              </div>
            </div>
  
            <div className='time-container'>
              {version.versionInfo.version.number}
            </div>
          </div>
        );
      });
    }

  }

  const handleVersionOpsClicked=()=>{
    const {versionInfo:{versionId=null}}=currentMcOptions;

    if(!versionId){
      messageApi.error("版本未安装，请点击开始游戏后安装");
    }else{
      console.log("to version options");
      
    }
  }

  const startGame=async()=>{
    // console.log("currentMcOptions",currentMcOptions);

    if(!currentMcOptions.hasOwnProperty("versionInfo")){
      messageApi.error("未选择版本");
      return;
    }
    
    setStartBtnAvailable(false);
    
    if(online){
      console.log("currentMcOptions",currentMcOptions);
      const {versionInfo,versionName,minecraftJar=null,versionJson=null}=currentMcOptions;
      const overrides={minecraftJar,versionJson};
      const authorization=onlineUsers.filter(user=>user.uuid===baseConfig.currentOnlineUser)[0] ?? null;
      
      if(authorization){
        const code=await window.minecraftApi.launchGame(online,versionInfo,authorization,versionName,overrides);
        // console.log("code",code);

        if(code===STATUS_CODE.ERROR){
          console.error("启动失败");
          
        }else{
          if(installedMcVersions.findIndex(version=>version.versionName===versionName)===-1){
            getInstalledVersions();
            getBaseConfig();
          }
        }

        setStartBtnAvailable(true);
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
                className={startBtnAvailable?"btn":"btn-disabled"}
                onClick={
                  startBtnAvailable?()=>setShowVersionSelector(true):null
                }
                >
                  版本选择
                </div>

                <div 
                className={startBtnAvailable?"btn":"btn-disabled"}
                onClick={handleVersionOpsClicked}
                >
                  版本设置
                </div>
              </div>

              <div className='row'>
                <div 
                  className={startBtnAvailable?"btn-start":"btn-start-disabled"}
                  onClick={
                    startBtnAvailable?startGame:null
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
