import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './sideBar.css';
import { Link } from 'react-router-dom';

class SideBar extends React.Component {
  static propTypes = {
    isSideBarOpen: PropTypes.bool.isRequired
  };

  render() {
    const { isSidebarOpen } = this.props;
    let sidebarClasses = classnames('sideBar', {
      'slideOutLeft animated': isSidebarOpen
    });
    return (
      <div>
        <div className={sidebarClasses}>

        <ul className="right hide-on-small-and-down">

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
      </div>
    );
  }
}

export default SideBar;
