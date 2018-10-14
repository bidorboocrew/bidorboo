import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
import combinedReducers from './reducers';
import { loadingBarMiddleware } from 'react-redux-loading-bar';

import createHistory from 'history/createBrowserHistory';
export const history = createHistory();

const getMiddleware = () => {
  if (process.env.NODE_ENV === 'production') {
    return applyMiddleware(promise(), loadingBarMiddleware(), thunk);
  }
  return applyMiddleware(promise(), loadingBarMiddleware(), thunk);
};

export const store = createStore(combinedReducers, composeWithDevTools(getMiddleware()));
