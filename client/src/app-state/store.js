import { applyMiddleware, createStore } from 'redux';
// import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
import combinedReducers from './reducers';
import createHistory from 'history/createBrowserHistory';
import { loadingBarMiddleware } from 'react-redux-loading-bar';

export const history = createHistory();

const getMiddleware = () => {
  if (process.env.NODE_ENV === 'production') {
    return applyMiddleware(promise(), loadingBarMiddleware(), thunk);
  }
  // Enable additional logging in non-production environments.
  // return applyMiddleware(promise(), thunk, createLogger());
  return applyMiddleware(
    promise(),
    loadingBarMiddleware(),
    thunk /*,createLogger()*/
  );
};

export const store = createStore(
  combinedReducers,
  composeWithDevTools(getMiddleware())
);
