import React, { useState } from 'react';

// import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateProfileDetails, updateProfileImage } from '../../app-state/actions/userModelActions';
import { getMyStripeAccountDetails } from '../../app-state/actions/paymentActions';
import { Spinner } from '../../components/Spinner';

import PaymentSetupForm from '../../components/forms/PaymentSetupForm';
import TaskerSetupForm from '../../components/forms/TaskerSetupForm';

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
    const pendingVerification = stripeConnect && stripeConnect.accId && !stripeConnect.isVerified;

    const verifiedAccount =
      stripeConnect &&
      stripeConnect.accId &&
      stripeConnect.isVerified &&
      stripeConnect.payoutsEnabled;

    return (
      <div className="columns is-centered">
        <div className="column is-narrow">
          {firstTimeSetup && <InitialAccountSetupView {...this.props} {...this.state} />}
          {/* {xxxxxxxxxxxxxx xxx you need to allow updates} */}
          {/* {pendingVerification && (
            <React.Fragment>
              <EstablishedAccountView {...this.props} />
            </React.Fragment>
          )} */}
          {verifiedAccount && (
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
              <HeaderTitle title="Tasker Onboarding" />

              <div className="content">
                <br />

                <div className="group">
                  <div className="label has-text-weight-semibold">
                    To become a tasker you must comply with these rules
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
                {/* <div style={{ marginBottom: 5 }}>
                  <label className="checkbox">
                    <input
                      value={isValidBankAcc}
                      onChange={(e) => setValidBankAcc(!isValidBankAcc)}
                      type="checkbox"
                    />
                    {` I have a Canadian Chequing Account.`}
                  </label>
                </div> */}
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
                    onChange={() => {
                      // if (!userMeetsTaskerRequirements) {
                      //   setNinteenPlus(true);
                      //   setCanadian(true);
                      //   setHasAgreedToTos(true);
                      // } else {
                      //   setNinteenPlus(false);
                      //   setCanadian(false);
                      //   setHasAgreedToTos(false);
                      // }
                    }}
                  />
                  <label
                    htmlFor="showPayoutSetupForm"
                    className="has-text-dark has-text-weight-semibold"
                  >
                    Start Tasker Onboarding
                  </label>
                </div>

                {/* {!(userMeetsTaskerRequirements) && (
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
                )} */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
      {userMeetsTaskerRequirements && (
        <>
          <TaskerSetupForm userDetails={userDetails}></TaskerSetupForm>
          <br></br>
          <br></br>

          <PaymentSetupForm userDetails={userDetails} />
        </>
      )}
    </React.Fragment>
  );
};
const EstablishedAccountView = (props) => {
  const { userDetails, myStripeAccountDetails } = props;

  let { stripeConnect } = userDetails;
  let istherePaymentDetails = myStripeAccountDetails && myStripeAccountDetails.balanceDetails;

  // const isAccountDisabled = !!accRequirements.disabled_reason;
  // const disabledReasonMsg =
  //   accRequirements.disabled_reason +
  //   ' \nPlease use the chat button at the bottom of the page to chat with our customer support.';
  // const deadlineToSubmitDocs = accRequirements.current_deadline;

  // const { external_account, individual } = currently_due;
  // const isLast4OfSinNeeded = false;
  // if (individual) {
  //   if (individual.ssn_last_4) {
  //     isLast4OfSinNeeded = true;
  //   }
  // }
  return (
    <section style={{ backgroundColor: 'white', padding: '0.25rem' }}>
      <HeaderTitle title="Account Details" />
      <br />

      <nav className="panel">
        <div className="panel-heading">
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
              <div className="panel-heading is-size-6 has-text-weight-semibold">
                <span className="has-text-success">
                  <span className="icon">
                    <i className="fas fa-check is-success" />
                  </span>
                  <span>Verified Account</span>
                </span>
              </div>

              <div style={{ padding: '0.5rem' }}>
                <div className="has-text-success">
                  <span className="icon">
                    <i className="fas fa-check is-success" />
                  </span>
                  <span>Congratulations your bank account is Verified.</span>
                </div>
                <div>Payouts will be sent to this bank acc upon completing Tasks.</div>
                <div className="help">
                  *To change your primary payout bank account click the chat button at the bottom of
                  the page
                </div>
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
              <div style={{ padding: '0.5rem' }}>
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
                  <p className="is-size-6">Potential Earnings</p>
                  <p className="help">*To be paid upon tasks completion</p>
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
                  <p className="is-size-6">Past Earnings</p>
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
