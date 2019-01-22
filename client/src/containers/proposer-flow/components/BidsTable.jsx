import React from 'react';
import ReactStars from 'react-stars';

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
      return (
        <React.Fragment>
          <TableWithNoBids />
        </React.Fragment>
      );
    }

    let tableRows = bidList.map((bid) => {
      const bidderRating = bid._bidderRef && bid._bidderRef.rating;
      return (
        <tr key={bid._id} style={{ wordWrap: 'break-word' }}>
          <td style={{ verticalAlign: 'middle' }} className="has-text-centered">
            <div>
              {/* bidder image */}
              {bid._bidderRef && bid._bidderRef.profileImage && bid._bidderRef.profileImage.url && (
                <figure style={{ margin: '0 auto' }} className="image is-32x32">
                  <img alt="profile" src={bid._bidderRef.profileImage.url} />
                </figure>
              )}
            </div>
            <div>
              {/* bidder rating */}
              {bidderRating && (
                <div>
                  User Rating
                  {bidderRating.globalRating === 'No Ratings Yet' ||
                  bidderRating.globalRating === 0 ? (
                    <p className="is-size-7">'No Ratings Yet' </p>
                  ) : (
                    <ReactStars
                      className="is-size-7"
                      half
                      count={5}
                      value={bidderRating.globalRating}
                      edit={false}
                      size={25}
                      color1={'lightgrey'}
                      color2={'#ffd700'}
                    />
                  )}
                </div>
              )}
            </div>
          </td>

          <td style={{ verticalAlign: 'middle' }} className="has-text-centered">
            <div>
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
                View
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
            <th className="has-text-centered">Bidder</th>
            <th className="has-text-centered">$</th>
            <th className="has-text-centered">Bid Details</th>
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
      <thead>
        <tr>
          <th>Bids Table</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ verticalAlign: 'middle' }}>
            No one has made a bid Yet, Keep an eye and check again in a little while
          </td>
        </tr>
      </tbody>
    </table>
  );
};
