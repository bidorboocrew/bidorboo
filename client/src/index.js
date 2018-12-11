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
// import { unregister } from './registerServiceWorker';

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
// check for service worker
// if ('serviceWorker' in navigator) {
//   send().catch((err) => console.error(err));
// }

//async function send() {
//register worker service.
// console.log('Register service worker...');
// const registration = await navigator.serviceWorker.register('sw.js', {
//   scope: '/',
// });
// console.log('service worker Registered...');

// const publicVapidKey =
//   'BNNIelsxMdODKuerQ6A28c0ASnc0YP7BygBjuTkR0qRgRSJXOonCx5Juk2VZgOLmiAbTl04zER-AbdRScMOzYfE';
// //Register push
// console.log('Registering Push...');
// const subscription = await registration.pushManager.subscribe({
//   userVisibleOnly: true,
//   applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
// });

// console.log('Push Registered...');

//send push notification
// console.log('Sending Push...');

// axios
//   .post('/api/register', {
//     data: JSON.stringify(subscription),
//     headers: {
//       'content-type': 'application/json',
//     },
//   })
//   .catch((err) => console.error('Push subscription error: ', err));

// console.log('Push Sent...');

// axios
//   .delete('/api/unregister', {
//     // data: JSON.stringify(subscription),
//     headers: {
//       'content-type': 'application/json',
//     },
//   })
//   .catch((err) => console.error('Push subscription error: ', err));
//}

// function urlBase64ToUint8Array(base64String) {
//   const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
//   const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

//   const rawData = window.atob(base64);
//   const outputArray = new Uint8Array(rawData.length);

//   for (let i = 0; i < rawData.length; ++i) {
//     outputArray[i] = rawData.charCodeAt(i);
//   }
//   return outputArray;
// }

registerServiceWorker();
// axios
//   .post('/api/register', {
//     //data: JSON.stringify(subscription),
//     headers: {
//       'content-type': 'application/json',
//     },
//   })
//   .catch((err) => console.error('Push subscription error: ', err));

// console.log('Push Sent...');
