import React from 'react';

import PaymentHandling from './PaymentHandling';

// confirm award and pay
const BIDORBOO_SERVICECHARGE = 0.06;
export default class ReviewBidAndBidder extends React.Component {
  render() {
    const { bid, closeModal } = this.props;

    if (!bid || !bid._id || !bid._bidderRef) {
      return null;
    }

    const {
      rating,
      membershipStatus,
      createdAt,
      displayName,
      profileImage,
      userId,
    } = bid._bidderRef;

    const bidderProfileImgUrl = profileImage.url;
    const bidderOverallRating = rating.globalRating;

    const bidAmount = bid.bidAmount.value;
    const bidOrBooServiceFee = Math.ceil(bidAmount * BIDORBOO_SERVICECHARGE);
    const totalAmount = bidAmount + bidOrBooServiceFee;

    return (
      <div className="modal is-active">
        <div onClick={closeModal} className="modal-background" />
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Accept {displayName}'s Bid</p>
            <button onClick={closeModal} className="delete" aria-label="close" />
          </header>
          <section className="modal-card-body">
            <table className="table is-fullwidth  is-bordered is-striped is-narrow ">
              <thead>
                <tr>
                  <th>Charge Detail</th>
                  <th />
                </tr>
              </thead>
              <tfoot>
                <tr>
                  <th>Total</th>
                  <th>{Math.ceil(bidAmount + bidOrBooServiceFee)} $CAD</th>
                </tr>
              </tfoot>
              <tbody>
                <tr>
                  <td>Bid Amount</td>
                  <td>{bidAmount} $CAD</td>
                </tr>
                <tr>
                  <td>BidOrBoo Service Fee</td>
                  <td>{bidOrBooServiceFee} $CAD</td>
                </tr>
              </tbody>
            </table>
            <div className="has-text-grey is-size-7"> What's Next?</div>
            <div className="help">* The amount of {`${totalAmount}`} CAD will be put on hold.</div>
            <div className="help">* When the job is completed this amount will be deducted.</div>
            <div className="help">
              * By proceeding you confirm that You agree with all
              <a target="_blank" rel="noopener noreferrer" href="bidorbooserviceAgreement">
                {` BidOrBoo Service Agreement Terms`}
              </a>
            </div>
          </section>
          <footer className="modal-card-foot">
            {/* <PaymentHandling
              amount={totalAmount * 100}
              jobId={job._id}
              bidderId={userUnderReview._id}
              beforePayment={awardBidderHandler}
              onCompleteHandler={() => {
                closeModal();
              }}
            /> */}

            <button style={{ marginLeft: 4 }} onClick={closeModal} className="button">
              Cancel
            </button>
          </footer>
        </div>
      </div>
    );
  }
}
