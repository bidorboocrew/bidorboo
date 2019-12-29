import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


import { submitPayment } from '../../../app-state/actions/paymentActions';
import * as Constants from '../../../constants/enumConstants';

class AcceptBidAndTaskerModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitClicked: false,
    };
  }

  submitBid() {
    const { bid, submitPayment } = this.props;

    this.setState(
      () => ({ submitClicked: true }),
      () => {
        submitPayment({ requestId: bid._requestRef, bidId: bid._id });
      },
    );
  }

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
            <div style={{ marginBottom: 10 }} className="has-text-centered">
              <figure
                style={{ marginBottom: 6, display: 'inline-block' }}
                className="image is-128x128"
              >
                <img
                  style={{
                    width: 128,
                    height: 128,
                    boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.34)',
                  }}
                  src={otherUserProfileInfo.profileImage.url}
                />
              </figure>
              <label style={{ marginBottom: 0 }} className="label has-text-dark is-size-5">
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
            <br></br>
            <div className="has-text-centered">
              <div style={{ marginBottom: 0, marginTop: 4 }}>
                Offered to do this request for a total price of
              </div>
              <div className="control is-size-5 has-text-weight-semibold has-text-success">
                {`${Math.ceil(totalCharge)} $CAD`}
              </div>
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
            <button style={{ marginLeft: 4 }} onClick={closeModal} className="button">
              <span>Close</span>
            </button>
            <button
              onClick={this.submitBid}
              className={`button is-success ${submitClicked ? 'is-loading' : null}`}
            >
              <span>Book Now</span>
              <span className="icon">
                <i className="fas fa-chevron-right" />
              </span>
            </button>
          </footer>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    submitPayment: bindActionCreators(submitPayment, dispatch),
  };
};

export default connect(null, mapDispatchToProps)(AcceptBidAndTaskerModal);
