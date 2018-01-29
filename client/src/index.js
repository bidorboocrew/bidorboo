import React from 'react';
import ReactDOM from 'react-dom';

//offline mode support
import registerServiceWorker from './registerServiceWorker';

//redux
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from './redux-state/reducers';

//materialize css
import 'typeface-roboto';

// import Reboot from 'material-ui/Reboot'; //this will do the normalization to avoid inconsistency accross browsers
// import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

//global styles
import './assets/styles/index.css';

import App from './containers/App';

//override some theme vars
// const theme = createMuiTheme({
//   palette: {
//     primary: {
//       light: '#ffffff',
//       main: '#ffffff',
//       dark: '#cccccc',
//       contrastText: '#622c8c'
//     },
//     secondary: {
//       light: '#82f0ef',
//       main: '#4bbdbd',
//       dark: '#008c8d',
//       contrastText: '#ffffff'
//     }
//   }
// });

//create our beautiful redux store
const store = createStore(reducers, {}, applyMiddleware());

ReactDOM.render(
  <Provider store={store}>
      {/* <MuiThemeProvider theme={theme}> */}
        <App />
      {/* </MuiThemeProvider> */}
  </Provider>,
  document.getElementById('BidOrBoo-app')
);

registerServiceWorker();
