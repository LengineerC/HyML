import React, { useState } from 'react';
import Card from '../../components/Card';
import { Switch, ConfigProvider, Popover, Spin, message } from 'antd';
import { 
  LoadingOutlined, 
  PoweroffOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS_CODE } from '../../../main/utils/enum';
import {
  SAVE_BASE_CONFIG,
  SAVE_ONLINE_USERS,
} from "../../redux/actions/constants";

import "./index.scss";


export default function Home() {
  const { onlineUsers, offlineUsers, baseConfig } = useSelector(state => state);
  const dispatch=useDispatch();
  const [messageApi,contextHolder]=message.useMessage();

  const [loginMode, setLoginMode] = useState(true);
  const [canLoginBtnClick,setCanLoginBtnClick]=useState(true);


  const loginError=()=>{
    messageApi.error("登录失败");
  }

  const loginSuccess=()=>{
    messageApi.success("登陆成功");
  }

  const operationBtns = {
    logOut: (
      <Popover
        key="log-out"
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
            退出登录
          </div>
        }
        placement="bottom"
      >
        <PoweroffOutlined
          className='icon'
        />
      </Popover>
    ),
    switchUser:(
      <Popover
        key="switch-user"
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
            切换账号
          </div>
        }
        placement="bottom"
      >
        <UserSwitchOutlined 
         className='icon'
        />
      </Popover>
    ),
  
  };

  const handleLogin=()=>{
    setCanLoginBtnClick(false);

    window.accountApi.login(value=>{
      if(value===STATUS_CODE.SUCCESS){
        window.fileApi.getBaseConfig(value=>{
          dispatch({
            type:SAVE_BASE_CONFIG,
            payload:value
          });
          
        });
  
        window.fileApi.getOnlineUsers(value=>{
          // console.log("render App:",value);
          dispatch({
            type:SAVE_ONLINE_USERS,
            payload:value
          });
  
        });

        loginSuccess();
      }else{
        loginError();
      }
      
      setCanLoginBtnClick(true);
    });
    
  }


  const createOnlineDisplay = () => {
    const currentOnlineUser = onlineUsers.filter(onlineUser => onlineUser?.uuid === baseConfig.currentOnlineUser)[0] || null;


    const avatar = currentOnlineUser ? (
      <img src={`https://crafatar.com/avatars/${currentOnlineUser.uuid}?size=128&overlay`} alt="" />
    ) : (<></>);

    let opBtns=[];
    if(currentOnlineUser){
      opBtns.push(operationBtns.switchUser);
      opBtns.push(operationBtns.logOut);
    }

    return (
      <>
        <div className='avatar'>
          {avatar}
        </div>

        <div className='name'>
          {currentOnlineUser?.name || (
            canLoginBtnClick ?(
              <div
                className='login-btn'
                onClick={handleLogin}
              >
                点击登录
              </div>
            ):(
              <div className='login-btn-disabled'>
                <Spin 
                  indicator={
                    <LoadingOutlined 
                      spin 
                      style={{
                        color:"#fff",
                        marginRight:"7px"
                      }}
                    />
                  } 
                />
                登录中
              </div>
            )
          )}
        </div>

        <div className={`actions ${currentOnlineUser ?? "transparent"}`}>
          {opBtns}
        </div>
      </>
    );
  }

  const createOfflineDisplay = () => {
    return (
      <>
        <div className='avatar'>
          <img src="https://crafatar.com/avatars/5264ac548e6447a381111b047390cf00?size=128&overlay" alt="" />
        </div>

        <div className='name'>
          LengineerC
        </div>

        <div className={`actions`}>
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
                退出登录
              </div>
            }
            placement="bottom"
          >
            <PoweroffOutlined
              className='icon'
            />
          </Popover>
        </div>
      </>
    );
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
        <div className='row-1'>
          <Card>
            <div className='account-container'>
              <div className='switch'>
                <Switch
                  checked={loginMode}
                  onChange={checked => setLoginMode(checked)}
                  checkedChildren="正版登录"
                  unCheckedChildren="离线登录"
                  style={{
                    borderRadius: "5px"
                  }}
                />
              </div>

              {
                loginMode ?
                  createOnlineDisplay() :
                  createOfflineDisplay()
              }
            </div>
          </Card>

          <Card>
            <div className='version-container'>

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
