import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './overlay.css';
class Overlay extends React.Component {
  static propTypes = {
    clickHandler: PropTypes.func.isRequired
  };

  render() {
    const { clickHandler } = this.props;
    return <div onClick={() => clickHandler()} className="sidenav-overlay" />;
  }
}

export default Overlay;
