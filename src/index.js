import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { HashRouter, Route } from 'react-router-dom'
import "./index.scss";
import "./variables.scss";
import "./flex.scss";
import store from "store/store.js"

import App from "views/pages/App/App.jsx";
import Specification from "views/pages/Specification/Specification.jsx";
import network from "client-network/client-network";

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <Route exact path="/" component={App} />
      <Route exact path="/specification" component={Specification} />
    </HashRouter>
  </Provider>,
  document.getElementById("root")
);