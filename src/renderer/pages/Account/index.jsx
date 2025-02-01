import React, { useState } from 'react';
import Card from '../../components/Card';
import { STATUS_CODE } from '../../../main/utils/enum';
import {
  SAVE_BASE_CONFIG,
  SAVE_ONLINE_USERS,
} from "../../redux/actions/constants";
import { useDispatch, useSelector } from 'react-redux';
import { Switch, Popover, message, Select } from 'antd';
import { 
  PlusOutlined, 
  PoweroffOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';

import "./index.scss";

export default function Account() {
  const dispatch=useDispatch();
  const { onlineUsers, offlineUsers, baseConfig } = useSelector(state => state);
  const [messageApi,contextHolder]=message.useMessage();

  const [loginMode, setLoginMode] = useState(true);
  const [canLoginBtnClick, setCanLoginBtnClick] = useState(true);

  const loginError = () => {
    messageApi.error("登录失败，请检查账号密码是否正确或该账号是否已经购买Minecraft");
  }

  const loginSuccess = () => {
    messageApi.success("登录成功");
  }

  const handleLogOut = async () => {
    const currentOnlineUser = onlineUsers.filter(onlineUser => onlineUser?.uuid === baseConfig.currentOnlineUser)[0];

    await window.accountApi.logout(currentOnlineUser);

    window.fileApi.getBaseConfig(value => {
      dispatch({
        type: SAVE_BASE_CONFIG,
        payload: value
      });

    });

    window.fileApi.getOnlineUsers(value => {
      // console.log("render App:",value);
      dispatch({
        type: SAVE_ONLINE_USERS,
        payload: value
      });

    });

    messageApi.success("退出登录成功");
  }


  const handleSwitchAccount = async () => {
    await window.fileApi.updateBaseConfig({
      ...baseConfig,
      currentOnlineUser: null
    });
    console.log("handleSwitchAccount");

    window.fileApi.getBaseConfig(value => {
      dispatch({
        type: SAVE_BASE_CONFIG,
        payload: value
      });

    });
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
          onClick={handleLogOut}
          className='icon'
        />
      </Popover>
    ),
    switchUser: (
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
          onClick={handleSwitchAccount}
          className='icon'
        />
      </Popover>
    ),

  };


  const handleLogin = () => {
    setCanLoginBtnClick(false);

    window.accountApi.login(value => {
      if (value === STATUS_CODE.SUCCESS) {
        window.fileApi.getBaseConfig(value => {
          dispatch({
            type: SAVE_BASE_CONFIG,
            payload: value
          });

        });

        window.fileApi.getOnlineUsers(value => {
          // console.log("render App:",value);
          dispatch({
            type: SAVE_ONLINE_USERS,
            payload: value
          });

        });

        loginSuccess();
      } else {
        loginError();
      }

      setCanLoginBtnClick(true);
    });

  }

  const createAccountOptions = () => {
    let options = [];
    if (loginMode) {
      onlineUsers.forEach((user, index) => {
        let option = {
          key: index,
          value: user.uuid,
          label: user.name
        };
        options.push(option);
      });

    } else {

    }

    return options;
  }

  const handleAccountSelected = async (value) => {
    console.log("handleAccountSelected", value);
    setCanLoginBtnClick(false);

    await window.fileApi.updateBaseConfig({
      ...baseConfig,
      currentOnlineUser: value
    });

    window.fileApi.getBaseConfig(value => {
      dispatch({
        type: SAVE_BASE_CONFIG,
        payload: value
      });

    });

    setCanLoginBtnClick(true);
  }

  const createOnlineDisplay = () => {
    const currentOnlineUser = onlineUsers.filter(onlineUser => onlineUser?.uuid === baseConfig.currentOnlineUser)[0] || null;

    const avatar = currentOnlineUser ? (
      <img src={`https://crafatar.com/avatars/${currentOnlineUser.uuid}?size=128&overlay`} alt="" />
    ) : (<></>);

    let opBtns = [];
    if (currentOnlineUser) {
      opBtns.push(operationBtns.switchUser);
      opBtns.push(operationBtns.logOut);
    }

    return (
      <>
        <div className='avatar'>
          {avatar}
        </div>

        <div className='name'>
          {currentOnlineUser?.name ||
            <div className='switch-container'>
              <Select
                size="small"
                style={{
                  width: "175px",
                }}
                disabled={!canLoginBtnClick}
                loading={!canLoginBtnClick}
                options={createAccountOptions()}
                onChange={handleAccountSelected}
              />

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
                    添加账号
                  </div>
                }
                placement="bottom"
              >
                <PlusOutlined
                  className={`add-btn ${!canLoginBtnClick && "disabled"}`}
                  onClick={
                    canLoginBtnClick ?
                      handleLogin :
                      () => { }
                  }
                />
              </Popover>

            </div>
          }
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
    <Card>
      {contextHolder}
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
  )
}
