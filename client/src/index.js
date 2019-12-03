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
import { registerPushNotification } from './registerPushNotification';

window.BidorBoo = window.BidorBoo || {};

if (process.env.NODE_ENV === 'production') {
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
    .then(({ registration }) => {
      registerPushNotification(`${process.env.REACT_APP_VAPID_KEY}`, registration)
        .then(() => console.log('push Notifications enabled'))
        .catch((e) => console.log('push Notifications not enabled ' + e));
    })
    .catch(() => console.info('ServiceWorker was not added'));
} else {
ReactDOM.render(
    <Provider store={store}>
      <Router history={appHistory}>
        <GetNotificationsAndScroll>
          <App />
        </GetNotificationsAndScroll>
      </Router>
    </Provider>,
    document.getElementById('BidOrBoo-app'),
  );
}
