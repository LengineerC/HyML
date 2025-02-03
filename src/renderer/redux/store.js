// import {legacy_createStore as createStore, compose} from "redux";
// import allReducers from "./reducers/allReducers";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import osInfoReducer from "./slices/osInfoSlice";
import configReducer from './slices/configSlice';
import minecraftReducer from "./slices/minecraftSlice";

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// const store= createStore(
//     allReducers,
//     composeEnhancers(),
// );


// export default store;

export default configureStore({
    reducer:{
        user:userReducer,
        osInfo:osInfoReducer,
        config:configReducer,
        minecraft:minecraftReducer,
    }
});