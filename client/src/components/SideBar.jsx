import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './sideBar.css';

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
        <div className={sidebarClasses}> </div>
      </div>
    );
  }
}

export default SideBar;
