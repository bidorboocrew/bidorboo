import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
import combinedReducers from './reducers';

import createHistory from 'history/createBrowserHistory';
export const history = createHistory();

const getMiddleware = () => {
  if (process.env.NODE_ENV === 'production') {
    return applyMiddleware(promise(), thunk);
  }
  return applyMiddleware(promise(), thunk);
};

export const store = createStore(combinedReducers, composeWithDevTools(getMiddleware()));
