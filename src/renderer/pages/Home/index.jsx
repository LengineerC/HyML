import React from 'react';
import Card from '../../components/Card';
import { Switch, ConfigProvider, Popover } from 'antd';
import { PoweroffOutlined } from '@ant-design/icons';

import "./index.scss";

export default function Home() {
  return (
    <ConfigProvider
      theme={{
        token:{
          colorPrimary:"#409EFF",
          colorPrimaryActive:"#2786e6",
        },

      }}
    >
      <div className='home-main'>
        <div className='row-1'>
          <Card>
            <div className='account-container'>
              <div className='switch'>
                <Switch 
                  checkedChildren="正版登录"
                  unCheckedChildren="离线登录"
                  style={{
                    borderRadius:"5px"
                  }}
                />
              </div>

              <div className='avatar'>
                <img src="https://crafatar.com/avatars/5264ac548e6447a381111b047390cf00?size=128&overlay" alt="" />
              </div>

              <div className='name'>
                LengineerC
              </div>

              <div className='actions'>
                <Popover
                  overlayInnerStyle={{
                    padding:"3px"
                  }}
                  content={
                    <div 
                      style={{
                        padding:"3px",
                        fontSize:"12px",
                        color:"#1f1e33"
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
