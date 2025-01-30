import React from "react";
import Home from "../pages/Home/index";
import Settings from "../pages/Settings";
import { Navigate } from "react-router-dom";

const routes=[
  {
    path:"/",
    element:<Navigate to={"/home"}/>
  },
  {
    path:"/home",
    element: <Home />
  },
  {
    path:"/settings",
    element:<Settings />
  },
];

export default routes;