import 'babel-polyfill';
// import 'typeface-roboto';

import React from 'react';
import ReactDOM from 'react-dom';
import bugsnag from '@bugsnag/js';
import bugsnagReact from '@bugsnag/plugin-react';

import { Provider } from 'react-redux';
import { StripeProvider } from 'react-stripe-elements';

import App from './containers/App';

import { store } from './app-state/store';
import { Router } from 'react-router-dom';
import appHistory from './react-router-history';
import GetNotificationsAndScroll from './GetNotificationsAndScroll';
import { registerServiceWorker } from './registerServiceWorker';

window.BidorBoo = window.BidorBoo || { SWRegistering: 0 };
const stripe = window.Stripe(`${process.env.REACT_APP_STRIPE_KEY}`);
window.BidorBoo.stripe = Object.freeze(stripe);

if (process.env.NODE_ENV === 'production') {
  // google analytics
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', 'UA-142687351-1');

  // freshcaht
  window.fcWidget.init({
    token: '379b1f75-9ffc-4de2-84d5-2fb284544f44',
    host: 'https://wchat.freshchat.com',
  });

  const bugsnagClient = bugsnag(`${process.env.REACT_APP_BUGSNAG_SECRET}`);
  bugsnagClient.use(bugsnagReact, React);
  const ErrorBoundary = bugsnagClient.getPlugin('react');
  ReactDOM.render(
    <ErrorBoundary>
      <StripeProvider apiKey={`${process.env.REACT_APP_STRIPE_KEY}`}>
        <Provider store={store}>
          <Router history={appHistory}>
            <GetNotificationsAndScroll>
              <App />
            </GetNotificationsAndScroll>
          </Router>
        </Provider>
      </StripeProvider>
    </ErrorBoundary>,
    document.getElementById('BidOrBoo-app'),
  );
} else {
  ReactDOM.render(
    <StripeProvider apiKey={`${process.env.REACT_APP_STRIPE_KEY}`}>
      <Provider store={store}>
        <Router history={appHistory}>
          <GetNotificationsAndScroll>
            <App />
          </GetNotificationsAndScroll>
        </Router>
      </Provider>
    </StripeProvider>,
    document.getElementById('BidOrBoo-app'),
  );
}

registerServiceWorker(`${process.env.REACT_APP_VAPID_KEY}`, false);
