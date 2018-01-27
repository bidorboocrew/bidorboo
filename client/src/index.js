import React from "react";
import ReactDOM from "react-dom";

//offline mode support
import registerServiceWorker from "./registerServiceWorker";

//redux
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reducers from "./reducers";


//global styles
import "./index.scss";

import App from "./containers/App";

const store = createStore(reducers, {}, applyMiddleware());
ReactDOM.render(
  <Provider store={store}>
      <App />
  </Provider>,
  document.getElementById("bidorboo-app")
);
registerServiceWorker();
