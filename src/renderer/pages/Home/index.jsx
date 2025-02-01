import React, { useEffect, useState } from 'react';
import Card from '../../components/Card';
import { ConfigProvider, message } from 'antd';
import { 
  CloseOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { getMinecraftVersions } from '../../services/minecraftService';
import mcVersionsJson from './mcversions';

import "./index.scss";

import mincraftIcon from "../../assets/images/minecraft.svg";
import Account from '../Account';
import { SAVE_MC_VERSIONS } from '../../redux/actions/constants';

const SELECTED_LOCATION={
  INSTALLED:0,
  DOWNLOAD:1,
};

export default function Home() {
  const dispatch=useDispatch();
  const { baseConfig, mcVersions } = useSelector(state => state);
  const [messageApi,contextHolder]=message.useMessage();

  const [showVersionSelector,setShowVersionSelector]=useState(false);
  const [selectedLocation,setSelectedLocation]=useState(SELECTED_LOCATION.INSTALLED);

  useEffect(()=>{
    getMinecraftVersions().then(mcVersions=>{
      // console.log(mcVersions.length);
      
      dispatch({
        type:SAVE_MC_VERSIONS,
        payload:mcVersions,
      });

    }).catch(err=>{
      console.error(err);
      
      messageApi.error("获取正式版本列表失败");
    });


  },[]);

  // useEffect(()=>{
  //   console.log("baseConfig",baseConfig);
    
  // },[baseConfig])


  const handleSelectedVersion=version=>{
    setShowVersionSelector(false);
    console.log(version);
  }

  const createVersions=()=>{
    if(mcVersions&&mcVersions.length>0){
      // console.log("mcVersions",mcVersions);
      
      // return mcVersionsJson.map((version,index)=>{
      //   const dateString=version.dateModified.substring(0,10);

      return mcVersions.map((version,index)=>{
        const date=new Date(version.dateModified);
        const dateString=date.toISOString().substring(0,10);
  
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
                <div className='btn-start'>
                  <div className='label'>
                    启动游戏
                  </div>

                  <div className='info'>
                    1.20.4
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
