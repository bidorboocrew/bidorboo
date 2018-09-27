import { combineReducers } from 'redux';

import { loadingBarReducer } from 'react-redux-loading-bar';

import authReducer from './authReducer';
import uiReducer from './uiReducer';
import userModelReducer from './userModelReducer';
import jobsReducer from './jobsReducer';
import bidsReducer from './bidsReducer';

export default combineReducers({
  authReducer: authReducer,
  uiReducer: uiReducer,
  userModelReducer: userModelReducer,
  jobsReducer: jobsReducer,
  bidsReducer: bidsReducer,
  loadingBar: loadingBarReducer,
});
