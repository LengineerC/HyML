import React, { useState } from 'react';
import Card from '../../../components/Card';
import { STATUS_CODE } from '../../../../main/utils/enum';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, message, Select } from 'antd';
import { 
  PlusOutlined, 
  PoweroffOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import TextPopover from "../../../components/TextPopover/index";
import { saveBaseConfig } from '../../../redux/slices/configSlice';
import { saveOnlineUsers } from '../../../redux/slices/userSlice';
import { saveOnline } from '../../../redux/slices/minecraftSlice';

import "./index.scss";

export default function Account() {
  const dispatch=useDispatch();
  const { onlineUsers, offlineUsers } = useSelector(state => state.user);
  const {baseConfig}=useSelector(state=>state.config);
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
      dispatch(saveBaseConfig(value));

    });

    window.fileApi.getOnlineUsers(value => {
      // console.log("render App:",value);
      dispatch(saveOnlineUsers(value));

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
      dispatch(saveBaseConfig(value));

    });
  }

  const operationBtns = {
    logOut: (
      <TextPopover
        key="log-out"
        placement="bottom"
        text="退出登录"
      >
        <PoweroffOutlined
          onClick={handleLogOut}
          className='icon'
        />
      </TextPopover>
      
    ),
    switchUser: (
      <TextPopover
        key="switch-user"
        placement='bottom'
        text='切换账号'
      >
         <UserSwitchOutlined
          onClick={handleSwitchAccount}
          className='icon'
        />
      </TextPopover>
    ),

  };


  const handleLogin = () => {
    setCanLoginBtnClick(false);

    window.accountApi.login(value => {
      if (value === STATUS_CODE.SUCCESS) {
        window.fileApi.getBaseConfig(value => {
          dispatch(saveBaseConfig(value));

        });

        window.fileApi.getOnlineUsers(value => {
          dispatch(saveOnlineUsers(value));

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
      dispatch(saveBaseConfig(value));

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

              <TextPopover
                text='添加账号'
              >
                <PlusOutlined
                  className={`add-btn ${!canLoginBtnClick && "disabled"}`}
                  onClick={
                    canLoginBtnClick ?
                    handleLogin :
                    () => { }
                  }
                />
              </TextPopover>
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
        </div>
      </>
    );
  }

  const handleLoginModeOnChange=checked=>{
    setLoginMode(checked);
    dispatch(saveOnline(checked));
  }

  return (
    <Card>
      {contextHolder}
      <div className='account-container'>
        <div className='switch'>
          <Switch
            checked={loginMode}
            onChange={handleLoginModeOnChange}
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
