import React, { useEffect, useState } from 'react';
import Card from '../../components/Card';
import { 
  SettingOutlined,
  FolderOpenOutlined,
  FolderOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { Input, Slider } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS_CODE } from '../../../main/utils/enum';
import TextPopover from '../../components/TextPopover';
import { saveBaseConfig } from '../../redux/slices/configSlice';

import "./index.scss";

export default function Settings() {
  const {baseConfig}=useSelector(state=>state.config);
  const osInfo=useSelector(state=>state.osInfo);
  
  const dispatch=useDispatch();

  const [currentBaseConfig,setCurrentBaseConfig]=useState(baseConfig);
  const [memory,setMemory]=useState(currentBaseConfig.maxMem);
  const [showEditMem,setShowEditMem]=useState(false);

  useEffect(()=>{
    setCurrentBaseConfig(baseConfig);
    setMemory(baseConfig.maxMem);

  },[baseConfig]);

  
  const getTotalMemoryGB=()=>
    Math.floor(osInfo.totalMemory/(1024*1024*1024));

  const editSavePath=async ()=>{
    const savePath=await window.fileApi.chooseResource("dir");
 
    if(savePath){
      dispatch(saveBaseConfig({
        ...baseConfig,
        savePath,
      }));
    }
    
  }

  const openSavePath=()=>{
    window.fileApi.openResourceDialog(baseConfig.savePath);
  }

  const saveMaxMemory=async()=>{
    if(currentBaseConfig.maxMem!==memory){

      const code=await window.fileApi.updateBaseConfig({
        ...currentBaseConfig,
        maxMem:memory
      });
      // console.log(code);
      

      if(code===STATUS_CODE.SUCCESS){
        const newBaseConfig=await window.fileApi.getBaseConfig();
        dispatch(saveBaseConfig(newBaseConfig));
      }
    }

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
              placeholder='请选择游戏保存路径'
              disabled
            />

            {currentBaseConfig?.savePath && 
            <TextPopover
              text='打开文件夹'
            >
              <FolderOpenOutlined 
                onClick={openSavePath}
                className='icon-btn'
              />
            </TextPopover>}

            <TextPopover
              text='修改文件夹'
            >
              <FolderOutlined
                onClick={editSavePath}
                className='icon-btn'
              />
            </TextPopover>
          </div>
        </div>

        <div className={`setting-item expand ${showEditMem&&"show"}`}>
          <div className='show-main'>
            <div className='setting-name'>最大内存</div>

            <div 
              style={{
                display:"flex",
              }}
            >
              <div
                style={{
                  display:"flex",
                  alignItems:"center",
                  marginLeft:"8px",
                  color:"#1f1e33"
                }}
              >
                <span style={{
                  marginRight:"3px",
                  fontWeight:"bold",
                }}>
                  {currentBaseConfig.maxMem}
                </span>
                GB
              </div>

              <RightOutlined 
                onClick={()=>{setShowEditMem(!showEditMem)}}
                className={`expand-icon ${showEditMem && "on-expand"}`}
              />
            </div>
          </div>

          <div className={`mem-expand-main ${showEditMem && "show"}`}>
            {
              showEditMem&&
              <>
              <Slider
                style={{
                  width:"30%"
                }}
                value={memory}
                min={1}
                max={getTotalMemoryGB()}
                step={1}
                onChange={value=>setMemory(value)}
              />

              <div
                style={{
                  display:"flex",
                  width:"30px",
                  alignItems:"center",
                  marginLeft:"8px",
                  marginRight:"10%",
                  color:"#1f1e33"
                }}
              >
                <span style={{
                  marginRight:"3px",
                  fontWeight:"bold",
                }}>
                  {memory}
                </span>
                GB
              </div>
              
              <div 
              className='save-btn'
              onClick={saveMaxMemory}
              >
                保存
              </div>
              </>
            }
          </div>
        </div>

      </Card>

    </div>
  );
}
