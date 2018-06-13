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
import { unregister } from './registerServiceWorker';

//redux
import { Provider } from 'react-redux';
//saidm make sure to update this package before relase
import { ConnectedRouter } from 'react-router-redux';

import App from './containers/App';

// import the store like this after moving this code somewhere else
import { store, history } from './app-state/store';
// registerServiceWorker();

// add bugsnag support to capture errors
// https://docs.bugsnag.com/platforms/browsers/react/#basic-configuration
const bugsnagClient = bugsnag('73a5b07dd9df6ea352bebda9e3ce4f62');
const ErrorBoundary = bugsnagClient.use(createPlugin(React));

ReactDOM.render(
  <ErrorBoundary>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>
  </ErrorBoundary>,
  document.getElementById('BidOrBoo-app')
);
unregister();
// registerServiceWorker();
