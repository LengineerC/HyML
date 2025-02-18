import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SELECTED_LOCATION, VERSION_TYPE } from '../../utils/enum';
import Card from '../../components/Card';
import { Input, message } from 'antd';
import { CheckOutlined, CloseOutlined, DownloadOutlined, FormOutlined } from '@ant-design/icons';
import { FILENAME_PATTERN } from "../../utils/regexp";
import TextPopover from '../../components/TextPopover';
import { useDispatch } from 'react-redux';
import { saveCurrentMcOptions } from '../../redux/slices/minecraftSlice';

import "./index.scss";

import grassBlockIcon from "../../assets/images/grass_block.svg";

export default function VersionOptions() {
  const dispatch=useDispatch();
  const navigate=useNavigate()
  const {param:version,type}=useLocation().state;
  const [messageApi,contextHolder]=message.useMessage();

  const [versionName,setVersionName]=useState(version.versionString);
  const versionNameInputRef=useRef(null);
  const [isValidVersionName,setIsValidVersionName]=useState(true);
  const [editingName,setEditingName]=useState(false);

  useEffect(()=>{
    console.log(version,type);

    if(type===SELECTED_LOCATION.DOWNLOAD){
      setVersionName(version.versionString);
    }else{
      setVersionName(version.versionName);
    }
    
  },[]);


  const checkVersionName=inputString=>{
    let isValidLength=true;
    let isValidFormat=true;

    if(!FILENAME_PATTERN.test(inputString)) isValidFormat=false;
    if(inputString.length>50 || inputString.length===0) isValidLength=false;

    if(isValidFormat && isValidLength) return true;
    else return false;
  }

  const handleVersionNameOnChange=e=>{
    const inputString=e.target.value;

    setIsValidVersionName(checkVersionName(inputString));
  }

  const saveVersionName=()=>{
    const inputString=versionNameInputRef.current.input.value;

    if(checkVersionName(inputString)){
      messageApi.success("设置成功");
      setVersionName(inputString);
      setEditingName(false);
    }else{
      messageApi.error("版本名格式有误");
    }
  }

  const handleSaveOptions=()=>{
    const {versionString}=version;

    if(type===SELECTED_LOCATION.DOWNLOAD){
      dispatch(saveCurrentMcOptions({
        versionName,
        versionInfo:{
          version:{
            number:versionString,
            type: VERSION_TYPE.RELEASE,
          },
        }
      }));

      navigate("/");

    }else if(type===SELECTED_LOCATION.INSTALLED){

    }
  }

  return (
    <div className='version-options-main'>
      {contextHolder}

      <TextPopover
        text='保存'
        placement="left"
      >
        <div 
          className='save-btn'
          onClick={handleSaveOptions}
        >
          <DownloadOutlined 
            className='save-icon'
          />
        </div>
      </TextPopover>

      <Card className='version-name-option'>
        <div className='version-icon'>
          <img src={grassBlockIcon} alt="" />
        </div>

        <div className='version-name'>
          <div className='label'>
            版本名:
          </div>

          {
            editingName?
            <>
            <Input 
              ref={versionNameInputRef}
              status={!isValidVersionName && "error"}
              defaultValue={versionName}
              onChange={e=>handleVersionNameOnChange(e)}
              maxLength={50}
            />
            <CheckOutlined  
              className='icon'
              style={{
                marginLeft:10,
                marginRight:5,
              }}
              onClick={saveVersionName}
            />

            <CloseOutlined
              onClick={()=>setEditingName(false)}
              className='icon'
            />
            </>:
            <>
            <div className='name-container'>
              {versionName}
            </div>

            <TextPopover
              text='修改'
            >
              <FormOutlined 
                className='icon'
                onClick={()=>setEditingName(true)}
              />
            </TextPopover>
            </>
          }
        </div>
      </Card>

    </div>
  )
}
