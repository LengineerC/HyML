import React from "react";
import { Navigate } from "react-router-dom";

import Home from "../pages/Home/index";
import Settings from "../pages/Settings";
import VersionOptions from "../pages/VersionOptions";
import KeepAlive from "react-activation";


const routes=[
  {
    path:"/",
    element:<Navigate to={"/home"} replace/>
  },
  {
    path:"/home",
    element: (
      <KeepAlive name="home">
        <Home />
      </KeepAlive>
    )
  },
  {
    path:"/version-options",
    element:<VersionOptions />
  },
  {
    path:"/settings",
    element: <Settings />
  },
];

export default routes;