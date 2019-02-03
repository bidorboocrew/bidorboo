import { combineReducers } from 'redux';
import { loadingBarReducer } from 'react-redux-loading-bar';

import uiReducer from './uiReducer';
import userReducer from './userReducer';
import jobsReducer from './jobsReducer';
import bidsReducer from './bidsReducer';

export default combineReducers({
  uiReducer: uiReducer,
  userReducer: userReducer,
  jobsReducer: jobsReducer,
  bidsReducer: bidsReducer,
  loadingBar: loadingBarReducer,
});
