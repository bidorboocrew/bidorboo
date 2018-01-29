import React from 'react';
import ReactDOM from 'react-dom';

//offline mode support
import registerServiceWorker from './registerServiceWorker';

//redux
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

//router setup
import { BrowserRouter } from 'react-router-dom';

//materialize css
import 'typeface-roboto';
//global styles
import './assets/styles/index.css';

import App from './containers/App';
import reducers from './redux-state/reducers';

//create our beautiful redux store
const store = createStore(reducers, {}, applyMiddleware());

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
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
