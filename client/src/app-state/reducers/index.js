import { combineReducers } from 'redux';
import { loadingBarReducer } from 'react-redux-loading-bar';

import authReducer from './authReducer';
import uiReducer from './uiReducer';
import routerReducer from './routerReducer';
import userModelReducer from './userModelReducer';
import jobsReducer from './jobsReducer';

export default combineReducers({
  authReducer: authReducer,
  uiReducer: uiReducer,
  routerReducer: routerReducer,
  userModelReducer: userModelReducer,
  jobsReducer: jobsReducer,
  loadingBar: loadingBarReducer
});
