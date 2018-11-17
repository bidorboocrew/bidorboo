import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import bugsnag from 'bugsnag-js';
import createPlugin from 'bugsnag-react';

//materialize css
// import 'typeface-roboto';

//offline mode support
// xxx said fix this default serviceworker is
// intercepting login auth flowhttps://www.reddit.com/r/javascript/comments/7evkzu/my_service_worker_is_intercepting_my/
// import registerServiceWorker from './registerServiceWorker';
// import { unregister } from './registerServiceWorker';

//redux
import { Provider } from 'react-redux';
import { StripeProvider } from 'react-stripe-elements';

import App from './containers/App';

// import the store like this after moving this code somewhere else
import { store } from './app-state/store';
import { Router } from 'react-router-dom';
import appHistory from './react-router-history';
import ScrollToTopOnRouteChange from './ScrollToTopOnRouteChange';
// registerServiceWorker();
// add bugsnag support to capture errors
// https://docs.bugsnag.com/platforms/browsers/react/#basic-configuration

console.log(`${process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}`);

if (process.env.NODE_ENV === 'production') {
  const bugsnagClient = bugsnag(`${process.env.REACT_APP_BUGSNAG_SECRET}`);
  const ErrorBoundary = bugsnagClient.use(createPlugin(React));
  ReactDOM.render(
    <ErrorBoundary>
      <StripeProvider apiKey={`${process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}`}>
        <Provider store={store}>
          <Router history={appHistory}>
            <ScrollToTopOnRouteChange>
              <App />
            </ScrollToTopOnRouteChange>
          </Router>
        </Provider>
      </StripeProvider>
    </ErrorBoundary>,
    document.getElementById('BidOrBoo-app'),
  );
} else {
  ReactDOM.render(
    <StripeProvider apiKey={`${process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}`}>
      <Provider store={store}>
        <Router history={appHistory}>
          <ScrollToTopOnRouteChange>
            <App />
          </ScrollToTopOnRouteChange>
        </Router>
      </Provider>
    </StripeProvider>,
    document.getElementById('BidOrBoo-app'),
  );
}
// unregister();
// registerServiceWorker();
