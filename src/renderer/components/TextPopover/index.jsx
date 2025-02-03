import React from 'react';
import { Popover } from 'antd';

import "./index.scss";

/**
 * 
 * @param {Object} props
 * @param {HTMLElement} props.children
 * @param {string} props.text
 * @param {'top' | 'left' | 'right' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom'} [props.placement="top"]
 * @returns 
 */
export default function TextPopover({children,text,placement="top"}) {
  // const uuid=(len, radix)=>{
  //   let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  //   let uuid = [], i;
  //   radix = radix || chars.length;

  //   if (len) {
  //     // Compact form
  //     for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
  //   } else {
  //     // rfc4122, version 4 form
  //     let r;

  //     // rfc4122 requires these characters
  //     uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
  //     uuid[14] = '4';

  //     // Fill in random data.  At i==19 set the high bits of clock sequence as
  //     // per rfc4122, sec. 4.1.5
  //     for (i = 0; i < 36; i++) {
  //       if (!uuid[i]) {
  //         r = 0 | Math.random()*16;
  //         uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
  //       }
  //     }
  //   }

  //   return uuid.join('');
  // }

  return (
     <Popover
      // key={key ?? uuid(16,666)}
      overlayInnerStyle={{
        padding: "3px"
      }}
      content={
        <div className='text-popover-content-container'>
          {text}
        </div>
      }
      placement={placement}
    >
      {children}
    </Popover>
  )
}
