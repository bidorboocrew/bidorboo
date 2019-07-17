import React from 'react';

// import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateProfileDetails, updateProfileImage } from '../../app-state/actions/userModelActions';
import { getMyStripeAccountDetails } from '../../app-state/actions/paymentActions';
import { Spinner } from '../../components/Spinner';
import * as ROUTES from '../../constants/frontend-route-consts';

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
      <div className="columns is-centered">
        <div className="column is-narrow">
          {(!stripeConnect || !stripeConnect.last4BankAcc) && (
            <InitialAccountSetupView
              {...this.props}
              {...this.state}
              toggleAddPaymentDetails={this.toggleAddPaymentDetails}
            />
          )}

          {stripeConnect && stripeConnect.last4BankAcc && (
            <React.Fragment>
              <EstablishedAccountView {...this.props} />
            </React.Fragment>
          )}
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
        <div className="group saidTest">
          <div style={{ minHeight: 'unset', height: 'unset' }} className="card limitLargeMaxWidth">
            <div style={{ minHeight: 'unset', height: 'unset' }} className="card-content">
              <HeaderTitle title="My Payments Details" />

              <div className="content">
                <br />
                <div className="group saidTest">
                  <input
                    id="showPayoutSetupForm"
                    type="checkbox"
                    name="showPayoutSetupForm"
                    className="switch is-rounded is-success"
                    checked={showAddPaymentDetails}
                    onChange={toggleAddPaymentDetails}
                  />
                  <label htmlFor="showPayoutSetupForm">
                    <strong>Setup Payout Banking Details</strong>
                  </label>
                  <div className="help">
                    * All Your data is secured via
                    <a href="https://stripe.com/ca" target="_blank">
                      {` Stripe payment gateway.`}
                    </a>
                    {` A world class secure payment processing platform.`} <br />
                  </div>
                  <div className="help">
                    * We will use this to deposit your earnings after completing tasks
                  </div>
                </div>

                {!showAddPaymentDetails && (
                  <React.Fragment>
                    {myStripeAccountDetails &&
                      myStripeAccountDetails.balanceDetails &&
                      myStripeAccountDetails.balanceDetails.potentialFuturePayouts > 0 && (
                        <div style={{ wordBreak: 'break-all' }}>
                          <label className="label">
                            These pending payments awaits your banking details registration
                          </label>
                          {`${JSON.stringify(myStripeAccountDetails.balanceDetails)}`}
                        </div>
                      )}
                  </React.Fragment>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
      {showAddPaymentDetails && (
        <PaymentSetupForm
          userDetails={userDetails}
          onCancel={toggleAddPaymentDetails}
          onSubmit={(vals) => console.log(vals)}
        />
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
          Earnings will be listed below
          {myStripeAccountDetails &&
            myStripeAccountDetails.balanceDetails &&
            myStripeAccountDetails.balanceDetails.potentialFuturePayouts > 0 && (
              <div style={{ wordBreak: 'break-all' }}>
                Pending Payments Amount
                {`${myStripeAccountDetails.balanceDetails.potentialFuturePayouts}`}
                Balance Details {`${JSON.stringify(myStripeAccountDetails.balanceDetails)}`}
              </div>
            )}
        </div>
      </nav>
    </section>
  );
};
