import React from 'react';

import "./index.scss";

export default function Card({children,style={}}) {

  return (
    <div 
      className={`card-main`}
      style={style}
    >
      {children}
    </div>
  )
}
