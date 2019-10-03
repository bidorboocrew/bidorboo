import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
import { loadingBarMiddleware } from 'react-redux-loading-bar';

import combinedReducers from './reducers';

export const history = require('history').createBrowserHistory();

const getMiddleware = () => {
  return applyMiddleware(promise, loadingBarMiddleware(), thunk);
};

let reduxStore = createStore(combinedReducers, composeWithDevTools(getMiddleware()));
if (process.env.NODE_ENV === 'production') {
  reduxStore = createStore(combinedReducers, getMiddleware());
}

export const store = reduxStore;
