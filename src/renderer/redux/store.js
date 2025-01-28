import {legacy_createStore as createStore, compose} from "redux";
import allReducers from "./reducers/allReducers";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store= createStore(
    allReducers,
    composeEnhancers(),
);


export default store;