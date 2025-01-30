import React, { useEffect, useState } from 'react';
import Card from '../../components/Card';
import { 
  SettingOutlined,
  FolderOpenOutlined,
  FolderOutlined,

} from '@ant-design/icons';
import { Input, Popover } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { SAVE_BASE_CONFIG } from '../../redux/actions/constants';

import "./index.scss";

export default function Settings() {
  const baseConfig=useSelector(state=>state.baseConfig);
  const dispatch=useDispatch();

  const [currentBaseConfig,setCurrentBaseConfig]=useState(baseConfig);

  useEffect(()=>{
    setCurrentBaseConfig(baseConfig);
  },[baseConfig]);


  const editSavePath=async ()=>{
    const savePath=await window.fileApi.chooseResource("dir");

    dispatch({
      type:SAVE_BASE_CONFIG,
      payload:{
        ...baseConfig,
        savePath
      }
    });
    
  }

  const openSavePath=()=>{
    window.fileApi.openResourceDialog(baseConfig.savePath);
  }

  return (
    <div className='settings-main'>
      <Card
        style={{
          width:"100%",
          // flex:"0",
          height:"auto",
          flexDirection:"column"
        }}
      >
        <div className='part-title'>
          <SettingOutlined 
            className='icon'
          />
          基础设置
        </div>

        <div className='dashed-hr' />

        <div className='setting-item'>
          <div className='setting-name'>
            游戏目录
          </div>

          <div
          style={{
            display:"flex",
            flexDirection:"row"
          }}
          >
            <Input 
              value={currentBaseConfig?.savePath ?? ""} 
              disabled
            />

            {currentBaseConfig?.savePath && <Popover
              overlayInnerStyle={{
                padding: "3px"
              }}
              content={
                <div
                  style={{
                    padding: "3px",
                    fontSize: "12px",
                    color: "#1f1e33"
                  }}
                >
                  打开文件夹
                </div>
              }
            >
              <FolderOpenOutlined 
                onClick={openSavePath}
                className='icon-btn'
              />
            </Popover>}

            <Popover
              overlayInnerStyle={{
                padding: "3px"
              }}
              content={
                <div
                  style={{
                    padding: "3px",
                    fontSize: "12px",
                    color: "#1f1e33"
                  }}
                >
                  修改文件夹
                </div>
              }
            >
              <FolderOutlined
                onClick={editSavePath}
                className='icon-btn'
              />
            </Popover>
          </div>
        </div>
      </Card>

    </div>
  );
}
