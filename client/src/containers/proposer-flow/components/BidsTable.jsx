import React from 'react';

// https://www.react-spinners.com/
import { css } from '@emotion/core';
import { GridLoader } from 'react-spinners';

import { UserImageAndRating } from '../../../containers/commonComponents';

// confirm award and pay
const BIDORBOO_SERVICECHARGE = 0.06;
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
      const totalCharge =
        bid.bidAmount && bid.bidAmount.value
          ? Math.ceil(bid.bidAmount.value * BIDORBOO_SERVICECHARGE) + bid.bidAmount.value
          : 'not specified';

      return (
        <tr key={bid._id} style={{ wordWrap: 'break-word' }}>
          <td style={{ verticalAlign: 'middle' }} className="has-text-centered">
            <UserImageAndRating userDetails={bid._bidderRef} />
          </td>

          <td style={{ verticalAlign: 'middle' }} className="has-text-centered">
            <div className="has-text-weight-bold">
              {totalCharge}
              {bid.bidAmount && bid.bidAmount.currency}
            </div>
          </td>

          <td style={{ verticalAlign: 'middle' }} className="has-text-centered">
            {bid._bidderRef && bid.bidAmount && (
              <a
                onClick={(e) => {
                  e.preventDefault();
                  this.openBidDetailsModal(bid);
                }}
                className="button is-success is-outlined"
                style={{ position: 'relative' }}
              >
                <span className="icon" style={{ margin: 0 }}>
                  <i className="fas fa-bullseye" />
                </span>

                {bid.isNewBid && (
                  <span
                    style={{ position: 'absolute', top: -4, right: -4, fontSize: 10 }}
                    className="has-text-danger"
                  >
                    <i className="fas fa-circle" />
                  </span>
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
            <th>Tasker Details</th>
            <th className="has-text-centered">Cost $</th>
            <th className="has-text-centered">Select One</th>
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
      <tbody>
        <tr>
          <td className="has-text-centered">
            <GridLoader css={override} sizeUnit={'px'} size={15} color={'#292929'} loading={true} />
            <div className="has-text-centered has-text-weight-semibold">
              No Taskers have bid on this job yet!
            </div>
            <div className="has-text-centered has-text-weight-semibold">
              BidOrBoo is notifying Taskers in your area
            </div>
            <div className="has-text-centered has-text-weight-semibold">
              You will be notified when you recieve bids. Check again soon
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
