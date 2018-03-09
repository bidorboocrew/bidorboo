import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { loadingBarReducer } from 'react-redux-loading-bar';

import authReducer from './authReducer';
import uiReducer from './uiReducer';
import routerReducer from './routerReducer';
import userModelReducer from './userModelReducer';

export default combineReducers({
  authReducer: authReducer,
  uiReducer: uiReducer,
  routerReducer: routerReducer,
  userModelReducer: userModelReducer,

  form: formReducer,
  loadingBar: loadingBarReducer
});
