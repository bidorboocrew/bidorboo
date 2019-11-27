import React, { useState } from 'react';

// import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateProfileDetails, updateProfileImage } from '../../app-state/actions/userModelActions';
import { getMyStripeAccountDetails } from '../../app-state/actions/paymentActions';
import { Spinner } from '../../components/Spinner';
import PaymentSetupForm from '../../components/forms/PaymentSetupForm';

import { getCurrentUser } from '../../app-state/actions/authActions';
import * as ROUTES from '../../constants/frontend-route-consts';

class PaymentSettings extends React.Component {
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

    const firstTimeSetup = !stripeConnect || !stripeConnect.accId || !stripeConnect.last4BankAcc;
    const showEarningsOnly = stripeConnect && stripeConnect.accId && !stripeConnect.last4BankAcc;

    const pendingVerification =
      stripeConnect &&
      stripeConnect.accId &&
      stripeConnect.last4BankAcc &&
      !stripeConnect.isVerified;

    const verifiedAccount =
      stripeConnect &&
      stripeConnect.accId &&
      stripeConnect.isVerified &&
      stripeConnect.last4BankAcc &&
      stripeConnect.payoutsEnabled;

    return (
      <>
        <section className="hero is-white">
          <div className="hero-body has-text-centered">
            <div className="container">
              <h1 style={{ marginBottom: 0 }} className="title">
                Payouts Settings
              </h1>
            </div>
          </div>
        </section>
        <div className="columns is-centered is-mobile">
          <div className="column limitLargeMaxWidth slide-in-right">
            {firstTimeSetup && <InitialAccountSetupView {...this.props} {...this.state} />}
            {/* {xxxxxxxxxxxxxx xxx you need to allow updates} */}
            {showEarningsOnly && (
              <React.Fragment>
                <ShowEarningsOnly {...this.props} />
              </React.Fragment>
            )}
            {pendingVerification && (
              <React.Fragment>
                <EstablishedAccountView {...this.props} />
              </React.Fragment>
            )}
            {verifiedAccount && (
              <React.Fragment>
                <EstablishedAccountView {...this.props} />
              </React.Fragment>
            )}
          </div>
        </div>
      </>
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

export default connect(mapStateToProps, mapDispatchToProps)(PaymentSettings);

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
  const { showAddPaymentDetails, userDetails, myStripeAccountDetails } = props;

  const [isNinteenPlus, setNinteenPlus] = useState(false);
  const [isCanadian, setCanadian] = useState(false);
  // const [isValidBankAcc, setValidBankAcc] = useState(false);
  const [hasAgreedToTOS, setHasAgreedToTos] = useState(false);

  const userMeetsTaskerRequirements = isNinteenPlus && isCanadian && hasAgreedToTOS;
  return (
    <React.Fragment>
      <div>
        <div className="group">
          <div style={{ minHeight: 'unset', height: 'unset' }} className="card">
            <div style={{ minHeight: 'unset', height: 'unset' }} className="card-content">
              <HeaderTitle title="Payout Requirements" />

              <div className="content">
                <br />

                <div className="group">
                  <div className="label has-text-weight-semibold">
                    To receive payouts you confirm the following:
                  </div>
                </div>
                <div style={{ marginBottom: 5 }}>
                  <label className="checkbox">
                    <input
                      value={isNinteenPlus}
                      onChange={(e) => setNinteenPlus(!isNinteenPlus)}
                      type="checkbox"
                    />
                    {` I am 19 years or older.`}
                  </label>
                </div>
                <div style={{ marginBottom: 5 }}>
                  <label className="checkbox">
                    <input
                      value={isCanadian}
                      onChange={(e) => setCanadian(!isCanadian)}
                      type="checkbox"
                    />
                    {` I am a resident of Canada.`}
                  </label>
                </div>

                <div style={{ marginBottom: 5 }}>
                  <label className="checkbox">
                    <input
                      onChange={() => setHasAgreedToTos(!hasAgreedToTOS)}
                      type="checkbox"
                      value={hasAgreedToTOS}
                    />
                    {` I confirm that I have read and agreed to`}
                    <a target="_blank" rel="noopener noreferrer" href={`${ROUTES.CLIENT.TOS}`}>
                      {` BidOrBoo Service Agreement `}
                    </a>
                    and
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://stripe.com/connect-account/legal"
                    >
                      {` Stripe Connected Account Agreement`}
                    </a>
                  </label>
                </div>
                <br></br>
                <div className="group">
                  <input
                    id="showPayoutSetupForm"
                    type="checkbox"
                    name="showPayoutSetupForm"
                    className="switch is-rounded is-success"
                    checked={userMeetsTaskerRequirements}
                    onChange={() => {}}
                  />
                  <label
                    htmlFor="showPayoutSetupForm"
                    className="has-text-dark has-text-weight-semibold"
                  >
                    Start Tasker Onboarding
                  </label>
                  <div className="help">
                    * After completing the tasks, payments will be sent to this bank
                  </div>
                  <div className="help">
                    * Your data is kept private, encrypted and secured via
                    <a href="https://stripe.com/ca" target="_blank">
                      {` Stripe `}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
      {userMeetsTaskerRequirements && <PaymentSetupForm userDetails={userDetails} />}
    </React.Fragment>
  );
};

const EstablishedAccountView = (props) => {
  const { userDetails, myStripeAccountDetails } = props;

  let { stripeConnect } = userDetails;
  let istherePaymentDetails = myStripeAccountDetails && myStripeAccountDetails.balanceDetails;

  return (
    <>
      <section style={{ backgroundColor: 'white', padding: '0.5rem' }}>
        <nav style={{ border: 'none', boxShadow: 'none' }} className="panel">
          <div style={{ borderRadius: 0 }} className="panel-heading">
            <div className="control">
              <label className="radio">
                <input type="radio" name="foobar" checked readOnly />
                {` Bank Account number ******`}
                <strong>{stripeConnect.last4BankAcc}</strong>
              </label>
            </div>
          </div>
          {(() => {
            const verificationStatus = stripeConnect.isVerified ? (
              <React.Fragment>
                <div style={{ padding: '0.5rem' }}>
                  <div className="has-text-success">
                    <span className="icon">
                      <i className="fas fa-check is-success" />
                    </span>
                    <span>Congratulations your bank account is Verified.</span>
                  </div>
                  <div>Payouts will be sent to this bank account after you complete each Task.</div>
                  <div className="help">
                    *To change your primary payout bank account click the chat button at the bottom
                    of the page
                  </div>
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div style={{ padding: '0.5rem' }}>
                  <span className="has-text-link">
                    <span className="icon">
                      <i className="far fa-clock" />
                    </span>
                    <span>Pending Verification</span>
                  </span>
                  <div>
                    The verification process may takes 5-10 days, however you are still able to bid
                    and perform tasks.
                  </div>
                  <div>
                    {' '}
                    All your payments will be paid immediately once we verify your account.
                  </div>
                  <div className="help">
                    *To change your primary payout bank account click the chat button at the bottom
                    of the page
                  </div>
                </div>
              </React.Fragment>
            );
            return verificationStatus;
          })()}
          <div
            style={{ borderRadius: 0 }}
            className="panel-heading is-size-6 has-text-weight-semibold"
          >
            Earnings Summary
          </div>
          <div style={{ padding: '0.5rem' }}>
            {istherePaymentDetails && (
              <div className="tile is-ancestor has-text-centered">
                <div className="tile is-parent">
                  <article className="tile is-child box">
                    <p style={{ marginBottom: 4 }} className="title has-text-weight-bold">
                      {myStripeAccountDetails.balanceDetails.potentialFuturePayouts &&
                      myStripeAccountDetails.balanceDetails.potentialFuturePayouts > 0
                        ? `${myStripeAccountDetails.balanceDetails.potentialFuturePayouts}$`
                        : `0$`}
                    </p>
                    <p className="is-size-6 has-text-weight-semibold">Expected Earnings</p>
                    <p className="help">*Will be paid as you complete each task</p>
                  </article>
                </div>
                <div className="tile is-parent">
                  <article className="tile is-child box">
                    <p style={{ marginBottom: 4 }} className="title has-text-weight-bold">
                      {myStripeAccountDetails.balanceDetails.pastEarnings &&
                      myStripeAccountDetails.balanceDetails.pastEarnings > 0
                        ? `${myStripeAccountDetails.balanceDetails.pastEarnings}$`
                        : `0$`}
                    </p>
                    <p className="is-size-6 has-text-weight-semibold">Past Earnings</p>
                    <p className="help">*Total of all past payouts</p>
                  </article>
                </div>
              </div>
            )}
          </div>
        </nav>
      </section>
    </>
  );
};

const ShowEarningsOnly = (props) => {
  const { userDetails, myStripeAccountDetails } = props;

  let { stripeConnect } = userDetails;
  let istherePaymentDetails = myStripeAccountDetails && myStripeAccountDetails.balanceDetails;

  return (
    <section style={{ backgroundColor: 'white', padding: '0.5rem' }}>
      <nav style={{ border: 'none', boxShadow: 'none' }} className="panel">
        <div
          style={{ borderRadius: 0 }}
          className="panel-heading is-size-6 has-text-weight-semibold"
        >
          Earnings Summary
        </div>
        <div style={{ padding: '0.5rem' }}>
          {istherePaymentDetails && (
            <div className="tile is-ancestor has-text-centered">
              <div className="tile is-parent">
                <article className="tile is-child box">
                  <p style={{ marginBottom: 4 }} className="title has-text-weight-bold">
                    {myStripeAccountDetails.balanceDetails.potentialFuturePayouts &&
                    myStripeAccountDetails.balanceDetails.potentialFuturePayouts > 0
                      ? `${myStripeAccountDetails.balanceDetails.potentialFuturePayouts}$`
                      : `0$`}
                  </p>
                  <p className="is-size-6 has-text-weight-semibold">Expected Earnings</p>
                  <p className="help">*Will be paid as you complete each task</p>
                </article>
              </div>
              <div className="tile is-parent">
                <article className="tile is-child box">
                  <p style={{ marginBottom: 4 }} className="title has-text-weight-bold">
                    {myStripeAccountDetails.balanceDetails.pastEarnings &&
                    myStripeAccountDetails.balanceDetails.pastEarnings > 0
                      ? `${myStripeAccountDetails.balanceDetails.pastEarnings}$`
                      : `0$`}
                  </p>
                  <p className="is-size-6 has-text-weight-semibold">Past Earnings</p>
                  <p className="help">*Total of all past payouts</p>
                </article>
              </div>
            </div>
          )}
        </div>
      </nav>
    </section>
  );
};
