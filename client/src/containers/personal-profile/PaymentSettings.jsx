import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateProfileDetails, updateProfileImage } from '../../app-state/actions/userModelActions';
import { getMyStripeAccountDetails } from '../../app-state/actions/paymentActions';
import { Spinner } from '../../components/Spinner';

import PaymentSetupForm from '../../components/forms/PaymentSetupForm';

import { getCurrentUser } from '../../app-state/actions/authActions';

class PaymentSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddPaymentDetails: false,
    };
  }

  toggleAddPaymentDetails = () => {
    this.setState({ showAddPaymentDetails: !this.state.showAddPaymentDetails });
  };

  componentDidMount() {
    this.props.getMyStripeAccountDetails();
  }

  render() {
    const { isLoggedIn, isLoadingStripeAccountDetails, userDetails } = this.props;

    if (!isLoggedIn) {
      return null;
    }

    if (isLoadingStripeAccountDetails) {
      return (
        <div className="container is-widescreen">
          <Spinner isLoading={isLoadingStripeAccountDetails} size={'large'} />
        </div>
      );
    }

    let { stripeConnect } = userDetails;

    return (
      <section style={{ padding: '0.5rem' }} className="section">
        <div className="columns is-centered">
          <div className="column is-narrow is-half">
            {(!stripeConnect || !stripeConnect.last4BankAcc) && (
              <InitialAccountSetupView
                {...this.props}
                {...this.state}
                toggleAddPaymentDetails={this.toggleAddPaymentDetails}
              />
            )}

            {stripeConnect && stripeConnect.last4BankAcc && (
              <EstablishedAccountView {...this.props} />
            )}
          </div>
        </div>
      </section>
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
    updateProfileDetails: bindActionCreators(updateProfileDetails, dispatch),
    updateProfileImage: bindActionCreators(updateProfileImage, dispatch),
    getCurrentUser: bindActionCreators(getCurrentUser, dispatch),
    getMyStripeAccountDetails: bindActionCreators(getMyStripeAccountDetails, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PaymentSettings);

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

const InitialAccountSetupView = (props) => {
  const {
    toggleAddPaymentDetails,
    showAddPaymentDetails,
    userDetails,
    myStripeAccountDetails,
  } = props;
  return (
    <React.Fragment>
      <div>
        <HeaderTitle title="BidOrBoo Tasker" />
        <p className="is-size-6">
          are you planning to become a BidOrBoo Tasker ?<br />
          do you want to do things you like at the time you wish ?
          <br />
          are you looking for a side gig to earn more income? <br /> <br />
          if you answered <strong>YES</strong> to any of these questions then let's start by setting
          up your payout details.
        </p>
        <br />
        <div className="field">
          <input
            id="showPayoutSetupForm"
            type="checkbox"
            name="showPayoutSetupForm"
            className="switch is-rounded is-success"
            checked={showAddPaymentDetails}
            onChange={toggleAddPaymentDetails}
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
      {!showAddPaymentDetails &&
        myStripeAccountDetails &&
        myStripeAccountDetails.balanceDetails &&
        myStripeAccountDetails.balanceDetails.potentialFuturePayouts > 0 && (
          <ProgressChart myStripeAccountDetails={myStripeAccountDetails} />
        )}
      {showAddPaymentDetails && (
        <div>
          <HeaderTitle title="Add Payout Details" />
          <div className="help">
            * To speed up verification and avoid delays in payout please
            <strong> enter all your details accurately</strong>
          </div>
          <div className="help">
            * Provide your info as it appears on your legal document such as your: Passport,
            government-issued ID, or driver's license
          </div>
          <br />
          <PaymentSetupForm
            userDetails={userDetails}
            onCancel={toggleAddPaymentDetails}
            onSubmit={(vals) => console.log(vals)}
          />
        </div>
      )}
    </React.Fragment>
  );
};
const EstablishedAccountView = (props) => {
  const { userDetails, myStripeAccountDetails } = props;

  let { stripeConnect } = userDetails;

  if (!myStripeAccountDetails) {
    return null;
  }

  const data = [{ name: 'Earnings', ...myStripeAccountDetails.balanceDetails }];
  return (
    <section style={{ backgroundColor: 'white', padding: '0.25rem' }}>
      <HeaderTitle title="Account Details" />
      <br />

      <nav className="panel">
        <div className="panel-heading">
          <div className="control">
            <label className="radio">
              <input type="radio" name="foobar" checked readOnly />
              {` Bank Account last 4 digits `}
              <strong>{stripeConnect.last4BankAcc}</strong>
            </label>
          </div>
        </div>
        {(() => {
          const verificationStatus = stripeConnect.isVerified ? (
            <React.Fragment>
              <div className="panel-heading is-size-6 has-text-weight-semibold">
                <span className="has-text-success">
                  <span className="icon">
                    <i className="fas fa-check is-success" />
                  </span>
                  <span>Verified Account</span>
                </span>
              </div>

              <div className="panel-block is-active">
                <span className="has-text-success">
                  <span className="icon">
                    <i className="fas fa-check is-success" />
                  </span>
                  <span>
                    Congratulations your account is Verified. All payments will be immediately paid
                    into your bank account upon completing tasks.
                  </span>
                </span>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div className="panel-heading is-size-6 has-text-weight-semibold">
                <span className="has-text-link">
                  <span className="icon">
                    <i className="far fa-clock" />
                  </span>
                  <span>Pending Verification</span>
                </span>
              </div>
              <div className="panel-block is-active">
                <p>
                  <strong>Don't Worry !</strong>
                  <br />
                  The verifiation Process usually takes 5-10 days, however you are still able to bid
                  and perform tasks. All your payments will be paid immediately once we verify your
                  account.
                </p>
              </div>
            </React.Fragment>
          );
          return verificationStatus;
        })()}
        <div className="panel-heading is-size-6 has-text-weight-semibold">Your Earnings</div>
        <div className="panel-block is-active">
          <ProgressChart myStripeAccountDetails={myStripeAccountDetails} />
        </div>
      </nav>
    </section>
  );
};

const ProgressChart = ({ myStripeAccountDetails }) => {
  const data = [{ name: 'Earnings', ...myStripeAccountDetails.balanceDetails }];

  return (
    <ResponsiveContainer minHeight={400}>
      <BarChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }} data={data}>
        <XAxis dataKey="name" />
        <YAxis unit="$" />
        <Tooltip formatter={(value) => `${value}$`} labelStyle={{ fontWeight: 700 }} />
        <Legend align="center" />
        <Bar stackId="a" dataKey="potentialFuturePayouts" name="Pending Payments" fill="#8884d8" />
        <Bar stackId="a" dataKey="pastEarnings" name="Paid Out" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
};
