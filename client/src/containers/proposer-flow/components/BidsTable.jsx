import React from 'react';

import { UserImageAndRating, VerifiedVia } from '../../../containers/commonComponents';

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
          <td style={{ verticalAlign: 'middle' }}>
            <UserImageAndRating userDetails={bid._bidderRef} large clipUserName={true} />
            <VerifiedVia userDetails={bid._bidderRef} isCentered={false} />
          </td>

          <td style={{ verticalAlign: 'middle' }} className="has-text-centered">
            <div className="tile is-ancestor has-text-centered">
              <div className="tile is-parent">
                <article
                  style={{
                    padding: '0.25rem',
                    cursor: 'pointer',
                    position: 'relative',
                    border: '2px solid hsl(141, 71%, 48%)',
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    this.openBidDetailsModal(bid);
                  }}
                  className="tile is-child box"
                >
                  <p style={{ marginBottom: 4 }} className="title has-text-weight-bold">
                    {totalCharge}
                  </p>
                  <p className="is-size-6">$ ({bid.bidAmount && bid.bidAmount.currency})</p>
                  <div className="help">Click To Review</div>
                  {bid.isNewBid && (
                    <span
                      style={{ position: 'absolute', top: -4, right: -4, fontSize: 10 }}
                      className="has-text-danger"
                    >
                      <i className="fas fa-circle" />
                    </span>
                  )}
                </article>
              </div>
            </div>
          </td>

          {/* <td style={{ verticalAlign: 'middle' }} className="has-text-centered">
            {bid._bidderRef && bid.bidAmount && (
              <a className="button is-success is-outlined" style={{ position: 'relative' }}>
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
          </td> */}
        </tr>
      );
    });

    return (
      <table className="table is-bordered is-hoverable table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>Tasker Details</th>
            <th className="has-text-centered">
              <div>Bid Amount</div>
              <div className="is-size-7 has-text-grey">(Task Cost)</div>
            </th>
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </table>
    );
  }
}

const TableWithNoBids = () => {
  return (
    <div className="card has-text-centered" style={{ height: 'unset' }}>
      <div className="card-content">
        <div className="content">
          <div className="title">
            <span className="icon">
              <i className="fas fa-user-clock" />
            </span>
            <span style={{ marginLeft: 7 }}>Waiting for Taskers</span>
          </div>
          <div className="subtitle">
            Taskers are reviewing your task and will place thier bids shortly
          </div>
        </div>
      </div>
    </div>
  );
};
