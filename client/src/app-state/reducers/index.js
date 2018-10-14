import { combineReducers } from 'redux';

import authReducer from './authReducer';
import uiReducer from './uiReducer';
import userModelReducer from './userModelReducer';
import jobsReducer from './jobsReducer';
import bidsReducer from './bidsReducer';
import { loadingBarReducer } from 'react-redux-loading-bar';

export default combineReducers({
  authReducer: authReducer,
  uiReducer: uiReducer,
  userModelReducer: userModelReducer,
  jobsReducer: jobsReducer,
  bidsReducer: bidsReducer,
  loadingBar: loadingBarReducer,
});
