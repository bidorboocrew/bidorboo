import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import registerServiceWorker from "./registerServiceWorker";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";

import App from "./containers/App";
import reducers from "./reducers";

const store = createStore(reducers, {}, applyMiddleware());
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("bidorboo-app")
);
registerServiceWorker();
