import React from 'react';
import BidderRootLocationFilter from './BidderRootLocationFilter';

// for reverse geocoding , get address from lat lng
// https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions
// https://stackoverflow.com/questions/6478914/reverse-geocoding-code

export default class BidderRootFilterWrapper extends React.Component {
  render() {
    const { isHorizontal = true } = this.props;
    return isHorizontal ? (
      <div style={{ border: '1px solid lightgrey ', padding: '1rem', background: '#eeeeee' }}>
        <div className="field is-horizontal">
          <div className="field-label is-normal">
            <label className="label">Edit Search Criteria</label>
          </div>

          <div className="field-body">
            <div className="field">
              <div className="control">
                <BidderRootLocationFilter {...this.props} />
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div style={{ border: '1px solid lightgrey ', padding: '1rem', background: '#eeeeee' }}>
        <div className="field">
          <div className="control">
            <BidderRootLocationFilter {...this.props} />
          </div>
        </div>
      </div>
    );
  }
}
