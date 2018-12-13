import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import bugsnag from 'bugsnag-js';
import createPlugin from 'bugsnag-react';
import axios from 'axios';

//materialize css
// import 'typeface-roboto';

//offline mode support
// xxx said fix this default serviceworker is
// intercepting login auth flowhttps://www.reddit.com/r/javascript/comments/7evkzu/my_service_worker_is_intercepting_my/
import registerServiceWorker from './registerServiceWorker';

//redux
import { Provider } from 'react-redux';
import { StripeProvider } from 'react-stripe-elements';

import App from './containers/App';

// import the store like this after moving this code somewhere else
import { store } from './app-state/store';
import { Router } from 'react-router-dom';
import appHistory from './react-router-history';
import ScrollToTopOnRouteChange from './containers/ScrollToTopOnRouteChange';
// registerServiceWorker();
// add bugsnag support to capture errors
// https://docs.bugsnag.com/platforms/browsers/react/#basic-configuration

if (process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === 'production') {
  const bugsnagClient = bugsnag(`${process.env.REACT_APP_BUGSNAG_SECRET}`);
  const ErrorBoundary = bugsnagClient.use(createPlugin(React));
  ReactDOM.render(
    <ErrorBoundary>
      {/* <StripeProvider apiKey={`${process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}`}> */}
      <Provider store={store}>
        <Router history={appHistory}>
          <ScrollToTopOnRouteChange>
            <App />
          </ScrollToTopOnRouteChange>
        </Router>
      </Provider>
      {/* </StripeProvider> */}
    </ErrorBoundary>,
    document.getElementById('BidOrBoo-app'),
  );
} else {
  ReactDOM.render(
    <Provider store={store}>
      <Router history={appHistory}>
        <ScrollToTopOnRouteChange>
          <App />
        </ScrollToTopOnRouteChange>
      </Router>
    </Provider>,
    document.getElementById('BidOrBoo-app'),
  );
}

registerServiceWorker();

// We need the service worker registration to check for a subscription
navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {
  // Do we already have a push message subscription?
  serviceWorkerRegistration.pushManager
    .getSubscription()
    .then((subscription) => {
      axios
        .post('/api/pushNotification', {
          data: JSON.stringify(subscription),
          headers: {
            'content-type': 'application/json',
          },
        })
        .catch((err) => console.error('Push subscription error: ', err));

      if (!subscription) {
        // We aren’t subscribed to push, so set UI
        // to allow the user to enable push
        return;
      }

      // // Keep your server in sync with the latest subscriptionId
      // sendSubscriptionToServer(subscription);

      // showCurlCommand(subscription);
    })
    .catch(function(err) {
      console.log('Error during getSubscription()', err);
    });
});
