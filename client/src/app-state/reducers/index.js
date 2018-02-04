import { combineReducers } from 'redux';
import authReducer from './authReducer';
import uiReducer from './uiReducer';
import routerReducer from './routerReducer';

export default combineReducers({
  authReducer: authReducer,
  uiReducer: uiReducer,
  routerReducer: routerReducer
});
