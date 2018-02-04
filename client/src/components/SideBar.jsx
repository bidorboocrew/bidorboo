import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './sideBar.css';
import { Link } from 'react-router-dom';

class SideBar extends React.Component {
  render() {
    let classNames_sidenav = classnames('animated slideInLeft');
    return (
      <div id="side-nav" className={classNames_sidenav}>
        <ul>
          <li>
            <Link to="/">Home content</Link>
          </li>
          <li>
            <Link to="/bidder">bidder content</Link>
          </li>
          <li>
            <Link to="/proposer">proposer content</Link>
          </li>
        </ul>
      </div>
    );
  }
}

export default SideBar;
