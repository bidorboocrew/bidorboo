import React from 'react';

import PropTypes from 'prop-types';
export default class BidOrBooCard extends React.Component {
  static propTypes = {
    cardContent: PropTypes.node.isRequired,
    onClickHandler: PropTypes.func.isRequired,
    logoImg: PropTypes.string.isRequired,
  };

  render() {
    const { cardContent, onClickHandler, logoImg } = this.props;
    return (
      <div style={{ cursor: 'pointer' }} onClick={onClickHandler} className="card">
        <div className="card-image">
          <img src={`${logoImg}`} className="bdb-home-page" />
        </div>
        <div className="card-content">
          <div className="content has-text-centered is-title has-text-black-bis">{cardContent}</div>
        </div>
      </div>

      // </div>
    );
  }
}
