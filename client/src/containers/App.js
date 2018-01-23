import React, { Component } from "react";

import logo from "../assets/logo.svg";
import "./App.scss";

class App extends Component {
  render() {
    return (
      <div className="container">
        <nav>
          <div className="nav-wrapper">
            <a href="#" className="brand-logo">
              BidOrBoo
            </a>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
              <li>
                <a href="sass.html">inbox</a>
              </li>
              <li>
                <a href="badges.html">stuff</a>
              </li>
              <li>
                <a href="collapsible.html">username</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}

export default App;
