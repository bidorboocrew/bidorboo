import 'core-js/stable';
import 'regenerator-runtime/runtime';
// import 'typeface-roboto';

import React from 'react';
import ReactDOM from 'react-dom';
import bugsnag from '@bugsnag/js';
import bugsnagReact from '@bugsnag/plugin-react';

import { Provider } from 'react-redux';

import App from './containers/App';

import { store } from './app-state/store';
import { Router } from 'react-router-dom';
import appHistory from './react-router-history';
import GetNotificationsAndScroll from './GetNotificationsAndScroll';
import { registerServiceWorker } from './registerServiceWorker';

window.BidorBoo = window.BidorBoo || {};

const bugsnagClient = bugsnag(`${process.env.REACT_APP_BUGSNAG_SECRET}`);
bugsnagClient.use(bugsnagReact, React);
const ErrorBoundary = bugsnagClient.getPlugin('react');
ReactDOM.render(
  <ErrorBoundary>
    <Provider store={store}>
      <Router history={appHistory}>
        <GetNotificationsAndScroll>
          <App />
        </GetNotificationsAndScroll>
      </Router>
    </Provider>
  </ErrorBoundary>,
  document.getElementById('BidOrBoo-app'),
);

registerServiceWorker()
  .then(() => null)
  .catch((e) => console.error(e));
