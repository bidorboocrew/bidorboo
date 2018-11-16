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
      <div style={{cursor: "pointer"}} onClick={onClickHandler} className="card homecard">
        <div className="card-image">
          <figure className="image is-2by2">
            <img src={logoImg} alt="Placeholder image" />
          </figure>
        </div>
        <div className="card-content">
          <div className="content">{cardContent}</div>
        </div>
      </div>

      // </div>
    );
  }
}
