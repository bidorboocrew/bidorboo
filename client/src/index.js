import React from "react";
import ReactDOM from "react-dom";



//offline mode support
import registerServiceWorker from "./registerServiceWorker";

//redux
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reducers from "./reducers";

//react toolbox
import './assets/react-toolbox/theme.scss';
import theme from './assets/react-toolbox/theme.js'
import ThemeProvider from "react-toolbox/lib/ThemeProvider";

//global styles
import "./index.scss";
import 'materialize-css/dist/css/materialize.min.css';

import App from "./containers/App";


const store = createStore(reducers, {}, applyMiddleware());
ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </Provider>,
  document.getElementById("bidorboo-app")
);
registerServiceWorker();
