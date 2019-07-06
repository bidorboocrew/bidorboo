import React from 'react';
import BidderRootLocationFilter from './BidderRootLocationFilter';

// for reverse geocoding , get address from lat lng
// https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions
// https://stackoverflow.com/questions/6478914/reverse-geocoding-code

export default class BidderRootFilterWrapper extends React.Component {
  render() {
    const { isHorizontal = true } = this.props;
    return isHorizontal ? (
      <div style={{ background: 'white', border: '1px solid #eeeeee ', padding: '1rem' }}>
        <div className="field">
          <BidderRootLocationFilter {...this.props} />
        </div>
      </div>
    ) : (
      <div style={{ border: '1px solid #eeeeee ', padding: '1rem' }}>
        <div className="field">
          <div className="control">
            <BidderRootLocationFilter {...this.props} />
          </div>
        </div>
      </div>
    );
  }
}
