import { combineReducers } from "redux";
import authReducer from "./authReducer";
import routerReducer from "./routerReducer";

export default combineReducers({
    auth: authReducer
    // router: routerReducer
});
