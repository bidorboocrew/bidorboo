import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import authReducer from './authReducer';
import uiReducer from './uiReducer';
import routerReducer from './routerReducer';

export default combineReducers({
  authReducer: authReducer,
  uiReducer: uiReducer,
  routerReducer: routerReducer,
  form: formReducer
});
