import React from 'react';

import "./index.scss";

export default function Card({children,style={},className=""}) {

  return (
    <div 
      className={`card-main ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}
