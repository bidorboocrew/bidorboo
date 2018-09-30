import React from 'react';
import { Proptypes_bidModel } from '../../client-server-interfaces';
import CommonJobDetailedCard from '../CommonJobDetailedCard';

export default class MyCurrentBidCardWithDetails extends React.Component {
  static propTypes = {
    bidDetails: Proptypes_bidModel
  };

  render() {
    const { bidDetails } = this.props;
    if (!bidDetails) {
      return null;
    }
    const { _job } = bidDetails;

    const bidAmountText = `${bidDetails.bidAmount.value} ${
      bidDetails.bidAmount.currency
    }`;

    return (
      <React.Fragment>
        <CommonJobDetailedCard job={_job} />

        <nav
          style={{ marginTop: 5, padding: 10, background: '#00d1b2' }}
          className="level"
        >
          <div className="level-item has-text-centered">
            <div style={{ color: 'white' }}>
              <p style={{ color: 'white' }} className="title is-5">
                My Bid
              </p>
              <p style={{ color: 'white' }} className="title">
                {`${bidAmountText} CAD`}
              </p>
            </div>
          </div>
        </nav>
      </React.Fragment>
    );
  }
}
