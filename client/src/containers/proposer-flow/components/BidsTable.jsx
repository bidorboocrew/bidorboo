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
            <UserImageAndRating userDetails={bid._bidderRef} large />
            <VerifiedVia userDetails={bid._bidderRef} isCentered={false} />
          </td>

          <td style={{ verticalAlign: 'middle' }} className="has-text-centered">
            <div className="tile is-ancestor has-text-centered">
              <div className="tile is-parent">
                <article
                  style={{ cursor: 'pointer', position: 'relative', border: '2px solid #31c110' }}
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
            <th className="has-text-centered">Total Cost</th>
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </table>
    );
  }
}

const TableWithNoBids = () => {
  return (
    <table className="table is-hoverable table is-striped is-fullwidth">
      <tbody>
        <tr>
          <td className="has-text-centered">
            <h1 className="subtitle">How it works?</h1>
            <div>
              <ul className="steps is-small has-content-centered is-horizontal">
                <li className="steps-segment">
                  <span className="steps-marker" />
                  <div className="steps-content">
                    <p className="is-size-6">Step 1</p>
                    <p>Select a Template.</p>
                  </div>
                </li>
                <li className="steps-segment is-active is-dashed">
                  <span className="steps-marker" />
                  <div className="steps-content">
                    <p className="is-size-6">Step 2</p>
                    <p>Wait for Bids.</p>
                  </div>
                </li>
                <li className="steps-segment ">
                  <span className="steps-marker" />
                  <div className="steps-content">
                    <p className="is-size-6">Step 3</p>
                    <p>Choose a Tasker.</p>
                  </div>
                </li>
              </ul>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
