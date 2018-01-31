import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

import './styles/header.css';

class Header extends React.Component {
  render() {
    return (
      <nav>
        <div className="applicationBar-FC">
          <div className="__logo">
            <i className="material-icons">menu</i>
          </div>
          <div className="__name hide-on-small-and-down">BidOrBoo</div>
          <div className="__search">
            <div className="search-wrapper">
              {/* <i class="material-icons">search</i> */}
              <input className="app-bar-main-search" />

              <div className="search-results" />
            </div>
          </div>
          <div className="__button_FC hide-on-small-and-down">
            <div className="__buttons">
              <a className="btn flat medium hover-effect">Signup</a>
              <a className="btn flat medium hover-effect">Login</a>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

export default Header;
