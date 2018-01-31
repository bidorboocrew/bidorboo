import React from 'react';
import ReactDOM from 'react-dom';

//materialize css
import 'typeface-roboto';
//global styles
import './assets/index.css';
//offline mode support
import registerServiceWorker from './registerServiceWorker';

//redux
import { Provider } from 'react-redux';
//saidm make sure to update this package before relase
import { ConnectedRouter } from 'react-router-redux';

import { Route, Switch } from 'react-router-dom';

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

registerServiceWorker();

// TODO SaidM delete later
//  {/* <MuiThemeProvider theme={theme}> */}
//  <App />
// {/* </MuiThemeProvider> */}
// import Reboot from 'material-ui/Reboot'; //this will do the normalization to avoid inconsistency accross browsers
// import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
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
