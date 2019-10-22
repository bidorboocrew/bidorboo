import React from 'react';

import * as ROUTES from '../../../constants/frontend-route-consts';
import AcceptBidPaymentHandling from './AcceptBidPaymentHandling';
import {
  BIDORBOO_SERVICECHARGE_FOR_REQUESTER,
  UserImageAndRating,
} from '../../../containers/commonComponents';

// confirm award and pay
const BIDORBOO_SERVICECHARGE = 0.06;
export default class AcceptBidAndBidderModal extends React.Component {
  render() {
    const { bid, closeModal } = this.props;

    if (!bid || !bid._id || !bid._bidderRef || !bid._jobRef) {
      return null;
    }

    const bidAmount = bid.bidAmount.value;
    const bidOrBooServiceFee = Math.ceil(bidAmount * BIDORBOO_SERVICECHARGE_FOR_REQUESTER);

    return (
      <div className="modal is-active">
        <div onClick={closeModal} className="modal-background" />
        <div className="modal-card">
          <header className="modal-card-head">
            <div className="modal-card-title">Book This Tasker</div>
            <button onClick={closeModal} className="delete" aria-label="close" />
          </header>
          <section className="modal-card-body">
            <UserImageAndRating userDetails={bid._bidderRef} />

            <div style={{ marginBottom: 0, marginTop: 4 }}>
              <span>{`Offered to do this task for a total of `}</span>
              <span className="control is-size-4 has-text-weight-semibold has-text-success">
                {Math.ceil(bidAmount + bidOrBooServiceFee)}$ (CAD)
              </span>
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
            {/* <label className="label">BIDORBOO Policy</label>
            <div className="help">After you pay :</div>
            <div className="help">* If the Tasker cancels. You will get a full refund.</div>
            <div className="help">
              <strong>
                * If YOU cancel this request after paying, you will only recieve a 80% refund.
              </strong>
            </div> */}
            <div className="help">
              * By proceeding you confirm that you agree with all
              <a target="_blank" rel="noopener noreferrer" href={`${ROUTES.CLIENT.TOS}`}>
                {` BIDORBOO Service Agreement Terms`}
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
            <button style={{ marginLeft: 4 }} onClick={closeModal} className="button">
              <span>Close</span>
            </button>
            <AcceptBidPaymentHandling
              bid={bid}
              onCompleteHandler={() => {
                closeModal();
              }}
            />
          </footer>
        </div>
      </div>
    );
  }
}
