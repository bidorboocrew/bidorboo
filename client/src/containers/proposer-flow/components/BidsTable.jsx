import React from 'react';
import ReactStars from 'react-stars';

// https://www.react-spinners.com/
import { css } from '@emotion/core';
import { GridLoader } from 'react-spinners';

import { UserImageAndRating } from '../../../containers/commonComponents';

export default class BidsTable extends React.Component {
  openBidDetailsModal = (bid) => {
    const { markBidAsSeen, jobId, showBidReviewModal } = this.props;

    if (bid.isNewBid) {
      markBidAsSeen(jobId, bid._id);
    }

    if (showBidReviewModal) {
      showBidReviewModal(bid);
    }
  };

  render() {
    const { bidList } = this.props;

    const areThereAnyBids = bidList && bidList.length > 0;

    if (!areThereAnyBids) {
      return <TableWithNoBids />;
    }

    let tableRows = bidList.map((bid) => {
      return (
        <tr key={bid._id} style={{ wordWrap: 'break-word' }}>
          <td style={{ verticalAlign: 'middle' }} className="has-text-centered">
            <UserImageAndRating userDetails={bid._bidderRef} />
          </td>

          <td style={{ verticalAlign: 'middle' }} className="has-text-centered">
            <div className="has-text-weight-bold">
              {bid.bidAmount && bid.bidAmount.value} {bid.bidAmount && bid.bidAmount.currency}
            </div>
          </td>

          <td style={{ verticalAlign: 'middle' }} className="has-text-centered">
            {bid._bidderRef && bid.bidAmount && (
              <a
                onClick={(e) => {
                  e.preventDefault();
                  this.openBidDetailsModal(bid);
                }}
                className="button is-success"
                style={{ position: 'relative' }}
              >
                <span className="icon">
                  <i className="fas fa-bullseye" />
                </span>
                <span>Award</span>
                {bid.isNewBid && (
                  <React.Fragment>
                    <div
                      style={{ position: 'absolute', top: -4, right: -4, fontSize: 10 }}
                      className="has-text-danger"
                    >
                      <i className="fas fa-circle" />
                    </div>
                  </React.Fragment>
                )}
              </a>
            )}
          </td>
        </tr>
      );
    });

    return (
      <table className="table is-bordered is-hoverable table is-striped is-fullwidth">
        <thead>
          <tr>
            <th className="has-text-centered">Tasker</th>
            <th className="has-text-centered">Bid $</th>
            <th className="has-text-centered">Bid Details</th>
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </table>
    );
  }
}

const TableWithNoBids = () => {
  const override = css`
    display: block;
    margin: 0 auto;
  `;
  return (
    <table className="table is-hoverable table is-striped is-fullwidth">
      <thead>
        <tr>
          <th />
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ verticalAlign: 'middle' }}>
            <GridLoader css={override} sizeUnit={'px'} size={15} color={'#292929'} loading={true} />
            <span className="has-text-weight-semibold">
              We are notifying Taskers in your area. Check again soon to see the latest bids
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
