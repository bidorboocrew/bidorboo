import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ROUTES from '../../../constants/frontend-route-consts';
import { switchRoute } from '../../../utils';

import { submitPayment } from '../../../app-state/actions/paymentActions';

class AcceptBidAndTaskerModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitClicked: false,
    };
  }

  submitBid = () => {
    const { bid, submitPayment } = this.props;

    this.setState(
      () => ({ submitClicked: true }),
      () => {
        submitPayment({ requestId: bid._requestRef, bidId: bid._id });
      },
    );
  };

  render() {
    const { bid, closeModal } = this.props;
    const { submitClicked } = this.state;

    if (!bid || !bid._id || !bid._taskerRef || !bid._requestRef) {
      return null;
    }
    const { value: totalCharge } = bid.requesterPayment;

    const otherUserProfileInfo = bid._taskerRef;
    const { rating, membershipStatus } = otherUserProfileInfo;

    // const membershipStatusDisplay = Constants.USER_MEMBERSHIP_TO_DISPLAY[membershipStatus];
    const { globalRating } = rating;
    return (
      <div className="modal is-active">
        <div onClick={closeModal} className="modal-background" />
        <div className="modal-card">
          <header className="modal-card-head">
            <div className="modal-card-title">Book This Tasker</div>
            <button onClick={closeModal} className="delete" aria-label="close" />
          </header>
          <section className="modal-card-body">
            <div style={{ marginBottom: 10 }} className="has-text-left">
              <figure
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  switchRoute(ROUTES.CLIENT.dynamicUserProfileForReview(otherUserProfileInfo._id));
                }}
                style={{ marginBottom: 6, display: 'inline-block' }}
                className="image is-64x64"
              >
                <img
                  style={{
                    width: 64,
                    height: 64,
                    boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.34)',
                  }}
                  src={otherUserProfileInfo.profileImage.url}
                />
              </figure>
              <label style={{ marginBottom: 0 }} className="label has-text-dark is-size-6">
                {otherUserProfileInfo.displayName}
              </label>
              {globalRating === 'No Ratings Yet' || globalRating === 0 ? (
                <div className="has-text-grey" style={{ fontSize: 18 }}>
                  <span className="icon has-text-warning">
                    <i className="far fa-star" />
                  </span>
                  <span>--</span>
                </div>
              ) : (
                <div className="has-text-dark" style={{ fontSize: 18 }}>
                  <span className="icon has-text-warning">
                    <i className="fas fa-star" />
                  </span>
                  <span>{globalRating}</span>
                </div>
              )}
              {/* <label className="help">Status: {membershipStatusDisplay}</label> */}
            </div>

            <div className="has-text-left">
              <div className="is-size-6" style={{ marginBottom: 0, marginTop: 4 }}>
                {`Will complete this chore for `}
                <span className="is-size-4 has-text-weight-bold has-text-success">
                  {`${Math.ceil(totalCharge)}$`}
                </span>
              </div>
            </div>
            <br></br>
            <div className="has-text-left help">
              <div className="has-text-weight-semibold">What happens after I book?</div>
              <ul>
                <li>- Your payment will be on hold with BidOrBoo</li>
                <li>- Tasker contact details will be revealed to you</li>
                <li>- After Tasker completes the work, they will get paid</li>
              </ul>
            </div>

            {/* <div
              style={{
                backgroundColor: ' whitesmoke',
                border: 'none',
                display: 'block',
                height: 2,
                margin: '0.5rem 0',
              }}
              className="navbar-divider"
            />
             <div className="help">
              * By proceeding you confirm that you agree with all
              <a target="_blank" rel="noopener noreferrer" href={`${ROUTES.CLIENT.TOS}`}>
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
            </div> */}
          </section>
          <footer className="modal-card-foot">
            <div style={{ display: 'block' }}>
              <button style={{ marginTop: 4 }} onClick={closeModal} className="button">
                <span>Close</span>
              </button>
              <button
                style={{ marginTop: 4 }}
                onClick={this.submitBid}
                className={`button is-success ${submitClicked ? 'is-loading' : null}`}
              >
                <span>{`Pay for booking`}</span>
                <span className="icon">
                  <i className="fas fa-chevron-right" />
                </span>
              </button>
              <div style={{ paddingTop: 8 }} className="help">
                <a
                  className="help"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={ROUTES.CLIENT.TOS}
                >
                  <span>{`By booking you confirm that you have read and agree with all `}</span>
                  <span style={{ textDecoration: 'underline' }}>
                    Terms Of Service | Privacy Policy
                  </span>
                </a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return { dispatch, submitPayment: bindActionCreators(submitPayment, dispatch) };
};

export default connect(null, mapDispatchToProps)(AcceptBidAndTaskerModal);
