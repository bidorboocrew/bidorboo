import { combineReducers } from 'redux';
import { loadingBarReducer } from 'react-redux-loading-bar';

import uiReducer from './uiReducer';
import userReducer from './userReducer';
import requestsReducer from './requestsReducer';
import bidsReducer from './bidsReducer';

export default combineReducers({
  uiReducer: uiReducer,
  userReducer: userReducer,
  requestsReducer: requestsReducer,
  bidsReducer: bidsReducer,
  loadingBar: loadingBarReducer,
});
