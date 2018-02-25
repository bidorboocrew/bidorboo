import React from 'react';
import PropTypes from 'prop-types';

import './styles/overlay.css';

class Overlay extends React.Component {
  static propTypes = {
    onCloseHandler: PropTypes.func.isRequired
  };

  render() {
    const { onCloseHandler } = this.props;
    return (
      <div
        onClick={() => onCloseHandler(true)}
        className="sidenav-overlay show-on-small hide-on-medium-and-up"
      />
    );
  }
}

export default Overlay;
