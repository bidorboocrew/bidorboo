import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import './styles/header.css';

class Header extends React.Component {
  render() {
    return (
      <nav>
        <div className="nav-wrapper header-wrapper">
          <a href="#" className="left brand-logo">
            <i class="material-icons">menu</i>
            <span className="hide-on-small-and-down">BidOrBoo</span>
            <span className="show-on-small-and-down hide-on-med-and-up">
              B.O.B
            </span>
          </a>

          <ul id="nav-mobile" className="right hide-on-small-and-down">
            <li>
              <a href="sass.html">Signup</a>
            </li>
            <li>
              <a href="badges.html">Login</a>
            </li>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/bidder">bidder</Link>
            </li>
            <li>
              <Link to="/proposer">proposer</Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default Header;
