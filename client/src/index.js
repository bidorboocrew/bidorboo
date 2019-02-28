import 'babel-polyfill';
// import 'typeface-roboto';

import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';

import App from './containers/App';

import { store } from './app-state/store';
import { Router } from 'react-router-dom';
import appHistory from './react-router-history';
import GetNotificationsAndScroll from './GetNotificationsAndScroll';
import { registerServiceWorker, unregister } from './registerServiceWorker';

window.BidorBoo = window.BidorBoo || {};

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
// registerServiceWorker(`${process.env.REACT_APP_VAPID_KEY}`);
// unregister()
