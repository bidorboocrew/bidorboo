import React from 'react';

import AcceptBidPaymentHandling from './AcceptBidPaymentHandling';
import { UserImageAndRating } from '../../../containers/commonComponents';

// confirm award and pay
const BIDORBOO_SERVICECHARGE = 0.06;
export default class AcceptBidAndBidderModal extends React.Component {
  render() {
    const { bid, closeModal } = this.props;

    if (!bid || !bid._id || !bid._bidderRef) {
      return null;
    }

    const bidAmount = bid.bidAmount.value;
    const bidOrBooServiceFee = Math.ceil(bidAmount * BIDORBOO_SERVICECHARGE);

    return (
      <div className="modal is-active">
        <div onClick={closeModal} className="modal-background" />
        <div className="modal-card">
          <header className="modal-card-head">
            <div className="modal-card-title">Offer Details</div>
            <button onClick={closeModal} className="delete" aria-label="close" />
          </header>
          <section className="modal-card-body">
            <UserImageAndRating userDetails={bid._bidderRef} />
            <div className="field">
              <label className="label">Offered to do this task for a total of</label>
              <p className="control is-size-4 has-text-weight-bold has-text-success">
                {Math.ceil(bidAmount + bidOrBooServiceFee)}$ (CAD)
              </p>
              <div className="help">
                * When you accept you will be redirected to our Secure Checkout inorder to process
                your payment
              </div>
            </div>
            <div
              style={{
                backgroundColor: ' whitesmoke',
                border: 'none',
                display: 'block',
                height: 2,
                margin: '0.5rem 0',
              }}
              className="navbar-divider"
            />
            <label className="label">BidOrBoo Policy</label>
            <div className="help">After you pay :</div>
            <div className="help">* If the Tasker cancels. You will get a full refund.</div>
            <div className="help">
              * If YOU cancel this request you will only recieve a 50% refund.
            </div>
            <div className="help">
              * By proceeding you confirm that you agree with all
              <a target="_blank" rel="noopener noreferrer" href="bidorbooserviceAgreement">
                {` BidOrBoo Service Agreement Terms`}
              </a>
              {` and the`}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://stripe.com/connect-account/legal"
              >
                {` Stripe Connected Account Agreement`}
              </a>
            </div>
          </section>
          <footer className="modal-card-foot">
            <AcceptBidPaymentHandling
              bid={bid}
              onCompleteHandler={() => {
                closeModal();
              }}
            />

            <button style={{ marginLeft: 4 }} onClick={closeModal} className="button">
              Go Back
            </button>
          </footer>
        </div>
      </div>
    );
  }
}
