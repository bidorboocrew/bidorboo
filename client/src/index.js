import 'babel-polyfill';
import 'typeface-roboto';

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

const stripe = window.Stripe(`${process.env.REACT_APP_STRIPE_KEY}`);

window.BidorBoo = {
  stripe: Object.freeze(stripe),
};
console.log();
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

//offline mode support
// xxx said fix this default serviceworker is
// intercepting login auth flowhttps://www.reddit.com/r/javascript/comments/7evkzu/my_service_worker_is_intercepting_my/
// import registerServiceWorker from './registerServiceWorker';
// import { unregister } from './registerServiceWorker';

// registerServiceWorker();
// add bugsnag support to capture errors
// https://docs.bugsnag.com/platforms/browsers/react/#basic-configuration

// unregister();
// registerServiceWorker();
