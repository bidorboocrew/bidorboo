import React from 'react';
import ReactDOM from 'react-dom';

//offline mode support
import registerServiceWorker from './registerServiceWorker';

//redux
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';

//materialize css
import 'typeface-roboto';

import Reboot from 'material-ui/Reboot'; //this will do the normalization to avoid inconsistency accross browsers
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

//global styles
import './index.css';

import App from './containers/App';

//override some theme vars
const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#ffffff',
      main: '#fafafa',
      dark: '#c7c7c7',
      contrastText: '#000000'
    },
    secondary: {
      light: '#87ffff',
      main: '#4bdbdb',
      dark: '#00a9aa',
      contrastText: '#2b2b2b'
    }
  }
});

//create our beautiful redux store
const store = createStore(reducers, {}, applyMiddleware());

ReactDOM.render(
  <Provider store={store}>
    <Reboot>
      <MuiThemeProvider theme={theme}>
        <div className="container">
          <App />
        </div>
      </MuiThemeProvider>
    </Reboot>
  </Provider>,
  document.getElementById('BidOrBoo-app')
);
registerServiceWorker();
