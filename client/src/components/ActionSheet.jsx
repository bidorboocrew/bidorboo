import React from 'react';
import PropTypes from 'prop-types';

export default class ActionSheet extends React.Component {
  render() {
    return this.props.children ? (
      <div className="bdb-ActionSheet slide-in-bottom" id="bdb-action-sheet">
        <div className="HorizontalAligner-center">{this.props.children}</div>
      </div>
    ) : null;
  }
}
