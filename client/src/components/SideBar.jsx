import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './sideBar.css'
class SideBar extends React.Component {

  render() {
    let sidebarClasses = classnames('sideBar')
    return (
      <div className={sidebarClasses}> </div>
    );
  }
}

export default SideBar;
