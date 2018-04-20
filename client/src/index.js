import "babel-polyfill";
import React from 'react';
import ReactDOM from 'react-dom';


//materialize css
import 'typeface-roboto';
//global styles
import './assets/index.css';
//offline mode support
// import registerServiceWorker from './registerServiceWorker';

//redux
import { Provider } from 'react-redux';
//saidm make sure to update this package before relase
import { ConnectedRouter } from 'react-router-redux';

import App from './containers/App';

// import the store like this after moving this code somewhere else
import { store, history } from './app-state/store';

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('BidOrBoo-app')
);

// registerServiceWorker();
