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

import App from './containers/App';

// import the store like this after moving this code somewhere else
import { store } from './app-state/store';
import { Router } from 'react-router-dom';
import appHistory from './react-router-history';
import ScrollToTopOnRouteChange from './ScrollToTopOnRouteChange';
// registerServiceWorker();

// add bugsnag support to capture errors
// https://docs.bugsnag.com/platforms/browsers/react/#basic-configuration
if (process.env.NODE_ENV === 'production') {
  const bugsnagClient = bugsnag(`${process.env.REACT_APP_BUGSNAG_SECRET}`);
  const ErrorBoundary = bugsnagClient.use(createPlugin(React));

  ReactDOM.render(
    <ErrorBoundary>
      <Provider store={store}>
        <Router history={appHistory}>
          <ScrollToTopOnRouteChange>
            <App />
          </ScrollToTopOnRouteChange>
        </Router>
      </Provider>
    </ErrorBoundary>,
    document.getElementById('BidOrBoo-app')
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
    document.getElementById('BidOrBoo-app')
  );
}
// unregister();
// registerServiceWorker();
