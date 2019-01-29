import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

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
    this.props.a_getMyStripeAccountDetails();
  }

  render() {
    const { isLoggedIn, isLoadingStripeAccountDetails, userDetails } = this.props;

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

    let { stripeConnect } = userDetails;

    return (
      <div className="container is-widescreen bidorbooContainerMargins">
        <div className="columns is-centered is-gapless">
          <div className="column">
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
  const { toggleAddPaymentDetails, showAddPaymentDetails, userDetails } = props;
  return (
    <section style={{ backgroundColor: 'white', padding: '0.25rem' }}>
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
    </section>
  );
};
const EstablishedAccountView = (props) => {
  const { userDetails, myStripeAccountDetails } = props;

  let { stripeConnect } = userDetails;

  if (!myStripeAccountDetails) {
    return null;
  }

  const earnings =
    myStripeAccountDetails.balanceDetails &&
    myStripeAccountDetails.balanceDetails.available.length > 0
      ? myStripeAccountDetails.balanceDetails.available[0].amount / 100
      : 0;
  const pendingPayments =
    myStripeAccountDetails.balanceDetails &&
    myStripeAccountDetails.balanceDetails.pending.length > 0
      ? myStripeAccountDetails.balanceDetails.pending[0].amount / 100
      : 0;

  const data = [{ name: 'Payments', pendingPayments: pendingPayments, earnings: earnings }];

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
        <div className="panel-heading is-size-6 has-text-weight-semibold">Account Status</div>
        <div className="panel-block is-active">
          {(() => {
            const verificationStatus = stripeConnect.isVerified ? (
              <span className="has-text-success">
                <span className="icon">
                  <i className="fas fa-check is-success" />
                </span>
                <span>Congratulations your account is Verified</span>
              </span>
            ) : (
              <span className="has-text-info">
                <span className="icon">
                  <i className="far fa-clock" />
                </span>
                <span>Awaiting Verification - we are working on it ! </span>
              </span>
            );
            return verificationStatus;
          })()}
        </div>
        <div className="panel-heading is-size-6 has-text-weight-semibold">Cash Flow</div>
        <div className="panel-block is-active">
          <ResponsiveContainer minHeight={400}>
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis name="$CAD" />
              <Tooltip />
              <Legend />
              <Bar dataKey="pendingPayments" name="Pending Transactions" fill="#8884d8" />
              <Bar dataKey="earnings" name="Verified Transactions" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </nav>
    </section>
  );
};
