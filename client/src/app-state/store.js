import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
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
  // Enable additional logging in non-production environments.
  // return applyMiddleware(promise(), thunk, createLogger());
  return applyMiddleware(promise(), thunk,createLogger());
};

export const store = createStore(
  combinedReducers,
  composeWithDevTools(getMiddleware())
);
