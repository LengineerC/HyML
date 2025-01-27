import React from 'react';

import "./index.scss";

export default function Card({children}) {

  return (
    <div 
      className={`card-main`}
    >
      {children}
    </div>
  )
}
