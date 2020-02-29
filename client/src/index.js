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
// import GetNotificationsAndScroll from './GetNotificationsAndScroll';
import { registerServiceWorker } from './registerServiceWorker';

window.BidOrBoo = window.BidOrBoo || {};
let bugsnagClient = {
  notify: () => null,
  leaveBreadcrumb: () => null,
};

/**
 * android phones only
 */
const urlParams = new URLSearchParams(window.location.search);
const oneSignalPlayerId = urlParams && urlParams.get('player_id');
if (oneSignalPlayerId) {
  window.localStorage.setItem('bob_androidOneSignalPlayerId', oneSignalPlayerId);
}
/**************************************************************************** */


if (process.env.NODE_ENV === 'production') {
  bugsnagClient = bugsnag({
    apiKey: `${process.env.REACT_APP_BUGSNAG_API_KEY}`,
    appVersion: '2.2.0',
  });
  bugsnagClient.use(bugsnagReact, React);
  const ErrorBoundary = bugsnagClient.getPlugin('react');
  ReactDOM.render(
    <Provider store={store}>
      <Router history={appHistory}>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </Router>
    </Provider>,
    document.getElementById('BidOrBoo-app'),
  );
} else {
  ReactDOM.render(
    <Provider store={store}>
      <Router history={appHistory}>
        <App />
      </Router>
    </Provider>,
    document.getElementById('BidOrBoo-app'),
  );
}

registerServiceWorker().catch(() => console.info('ServiceWorker was not added'));

export const getBugsnagClient = () => bugsnagClient;
