import React, {memo} from "react";
import { Navigate } from "react-router-dom";

import Home from "../pages/Home/index";
import Settings from "../pages/Settings";
import VersionOptions from "../pages/VersionOptions";

// const Home = memo(() => import("../pages/Home/index"));
// const Settings = memo(() => import("../pages/Settings"));
// const VersionOptions = memo(() => import("../pages/VersionOptions"));

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
    path:"/version-options",
    element:<VersionOptions />
  },
  {
    path:"/settings",
    element:<Settings />
  },
];

export default routes;