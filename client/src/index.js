import 'core-js/stable';
import 'regenerator-runtime/runtime';
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
const stripe = window.Stripe ? window.Stripe(`${process.env.REACT_APP_STRIPE_KEY}`) : {};
window.BidorBoo.stripe = Object.freeze(stripe);

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

registerServiceWorker(`${process.env.REACT_APP_VAPID_KEY}`, false);
