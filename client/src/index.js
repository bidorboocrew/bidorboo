import 'babel-polyfill';
// import 'typeface-roboto';

import React from 'react';
import ReactDOM from 'react-dom';
import bugsnag from 'bugsnag-js';
import createPlugin from 'bugsnag-react';
import { Provider } from 'react-redux';
import { StripeProvider } from 'react-stripe-elements';

import App from './containers/App';

import { store } from './app-state/store';
import { Router } from 'react-router-dom';
import appHistory from './react-router-history';
import GetNotificationsAndScroll from './GetNotificationsAndScroll';
import { registerServiceWorker, unregister } from './registerServiceWorker';

const stripe = window.Stripe(`${process.env.REACT_APP_STRIPE_KEY}`);

window.BidorBoo = window.BidorBoo || {};
window.BidorBoo.stripe = Object.freeze(stripe);

const bugsnagClient = bugsnag(`${process.env.REACT_APP_BUGSNAG_SECRET}`);
const ErrorBoundary = bugsnagClient.use(createPlugin(React));
if (process.env.NODE_ENV === 'development') {
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
} else {
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
}
if (process.env.NODE_ENV === 'production') {
  registerServiceWorker(`${process.env.REACT_APP_VAPID_KEY}`);
}
// unregister();
