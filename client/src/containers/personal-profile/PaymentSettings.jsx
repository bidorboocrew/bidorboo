import React from 'react';
import ReactStars from 'react-stars';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateProfileDetails, updateProfileImage } from '../../app-state/actions/userModelActions';
import { getMyStripeAccountDetails } from '../../app-state/actions/paymentActions';
import { Spinner } from '../../components/Spinner';

import PaymentSetupForm from '../../components/forms/PaymentSetupForm';

import { getCurrentUser } from '../../app-state/actions/authActions';

class MyProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddPaymentDetails: true,
    };
  }

  toggleAddPaymentDetails = () => {
    this.setState({ showAddPaymentDetails: !this.state.showAddPaymentDetails });
  };

  componentDidMount() {
    this.props.a_getMyStripeAccountDetails();
  }

  render() {
    const {
      userDetails,
      isLoggedIn,
      isLoadingStripeAccountDetails,
      myStripeAccountDetails,
    } = this.props;

    if (!isLoggedIn) {
      return null;
    }

    if (isLoadingStripeAccountDetails) {
      return (
        <div className="container is-widescreen bidorbooContainerMargins">
          <Spinner isLoading={isLoadingStripeAccountDetails} size={'large'} />
        </div>
      );
    }

    let { personalParagraph, stripeConnect } = userDetails;

    personalParagraph = personalParagraph || 'not provided';

    const { showAddPaymentDetails } = this.state;
    return (
      <div className="container is-widescreen bidorbooContainerMargins">
        <div className="columns is-centered is-gapless">
          <div className="column">
            {/* user without a registered account */}
            {(!stripeConnect || !stripeConnect.last4BankAcc) && (
              <section style={{ backgroundColor: 'white', padding: '0.25rem' }}>
                <div>
                  <HeaderTitle title="BidOrBoo Tasker" />
                  <p className="is-size-6">
                    are you planning to become a BidOrBoo Tasker ?<br />
                    do you want to do things you like at the time you wish ?
                    <br />
                    are you looking for a side gig to earn more income? <br /> <br />
                    if you answered <strong>YES</strong> to any of these questions then let's start
                    by setting up your payout details.
                  </p>
                  <br />
                  <div className="field">
                    <input
                      id="showPayoutSetupForm"
                      type="checkbox"
                      name="showPayoutSetupForm"
                      className="switch is-rounded is-success"
                      checked={showAddPaymentDetails}
                      onChange={this.toggleAddPaymentDetails}
                    />
                    <label htmlFor="showPayoutSetupForm">
                      <strong>Add Payout Details</strong>
                    </label>
                  </div>

                  <div className="help">
                    * Your data is secured via
                    <a href="https://stripe.com/ca" target="_blank">
                      {` Stripe payment gateway.`}
                    </a>
                    {` A world class secure payment processing platform.`} <br />
                    {`BidOrBoo will not store or share any of your sensitive details`}
                  </div>
                  <br />
                </div>

                {showAddPaymentDetails && (
                  <div>
                    <HeaderTitle title="Add Payout Details" />
                    <div className="help">
                      * To speed up verification and avoid delays in payout please
                      <strong> enter all your details accurately</strong>
                    </div>
                    <div className="help">
                      * Provide your info as it appears on your legal document such as your:
                      Passport, government-issued ID, or driver's license
                    </div>
                    <br />
                    <PaymentSetupForm
                      userDetails={userDetails}
                      onCancel={this.toggleAddPaymentDetails}
                      onSubmit={(vals) => console.log(vals)}
                    />
                  </div>
                )}
              </section>
            )}
            {stripeConnect && stripeConnect.last4BankAcc && (
              <section style={{ backgroundColor: 'white', padding: '0.25rem' }}>
                <HeaderTitle title="Your Payout Account Details" />
                <br />
                <div className="field is-grouped">
                  <div>Last 4 Digits of the bank account</div>
                  <div className="has-text-weight-semibold" style={{ marginLeft: 10 }}>
                    {stripeConnect.last4BankAcc}
                  </div>
                </div>
                <div className="field is-grouped">
                  <div>Verification Status</div>
                  <div className="has-text-weight-semibold" style={{ marginLeft: 10 }}>
                    {stripeConnect.isVerified ? ' verified account' : ' pending verification'}
                  </div>
                </div>

                <p>
                  {myStripeAccountDetails &&
                    myStripeAccountDetails.balanceDetails &&
                    JSON.stringify(myStripeAccountDetails.balanceDetails)}
                </p>
              </section>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ userReducer }) => {
  return {
    userDetails: userReducer.userDetails,
    isLoggedIn: userReducer.isLoggedIn,
    myStripeAccountDetails: userReducer.myStripeAccountDetails,
    isLoadingStripeAccountDetails: userReducer.isLoadingStripeAccountDetails,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    a_updateProfileDetails: bindActionCreators(updateProfileDetails, dispatch),
    a_updateProfileImage: bindActionCreators(updateProfileImage, dispatch),
    a_getCurrentUser: bindActionCreators(getCurrentUser, dispatch),
    a_getMyStripeAccountDetails: bindActionCreators(getMyStripeAccountDetails, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyProfile);

const HeaderTitle = (props) => {
  const { title, specialMarginVal } = props;
  return (
    <h2
      style={{
        marginTop: specialMarginVal || 0,
        marginBottom: 4,
        fontSize: 20,
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
      }}
    >
      {title}
    </h2>
  );
};
const DisplayLabelValue = (props) => {
  return (
    <div style={{ padding: 4, marginBottom: 4 }}>
      <div style={{ color: 'grey', fontSize: 14 }}>{props.labelText}</div>
      <div style={{ fontSize: 16 }}> {props.labelValue}</div>
    </div>
  );
};

const userImageAndStats = (profileImage, membershipStatusDisplay, rating, displayName) => {
  const { globalRating } = rating;
  return (
    <div style={{ padding: '0.25rem', height: '100%' }} className="has-text-dark">
      <div>
        <div>
          <img className="bdb-img-profile-pic" src={`${profileImage.url}`} />
        </div>
      </div>

      <div className="field">
        <label className="label">Name</label>
        <div className="control">
          <div className="control">{displayName}</div>
        </div>
      </div>
      <div className="field">
        <label className="label">Rating</label>
        {globalRating === 'No Ratings Yet' || globalRating === 0 ? (
          <p className="is-size-7">No Ratings Yet</p>
        ) : (
          <div className="control">
            <span>
              <ReactStars
                half
                count={5}
                value={globalRating}
                edit={false}
                size={25}
                color1={'lightgrey'}
                color2={'#ffd700'}
              />
            </span>
            <span style={{ color: 'black' }} className="has-text-weight-semibold">
              ({globalRating})
            </span>
          </div>
        )}
      </div>
      <div className="field">
        <label className="label">Status</label>
        <div className="control">
          <div className="control">{membershipStatusDisplay}</div>
        </div>
      </div>
    </div>
  );
};
