import React from 'react';
import ReactDOM from 'react-dom';

import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getMyStripeAccountDetails } from '../../app-state/actions/paymentActions';
import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';
import TaskerSetupForm from '../../components/forms/TaskerSetupForm';

class TaskerVerificationBanner extends React.Component {
  constructor(props) {
    super(props);

    this.state = { showUploadImgModal: false };
  }
  componentDidMount() {
    this.props.getMyStripeAccountDetails();
  }

  startupTaskerProfile = async () => {
    try {
      const { data } = await axios.get(
        `${ROUTES.API.PAYMENT.GET.accountLinkForSetupAndVerification}/?redirectUrl=${window.location.href}`,
      );
      if (data.success && data.accountLinkUrl) {
        window.location = data.accountLinkUrl;
      }
    } catch (e) {
      alert(`sorry we couldn't establish connection with stripe`);
    }
  };

  updateTaskerProfile = async () => {
    try {
      const { data } = await axios.get(
        `${ROUTES.API.PAYMENT.GET.accountLinkForUpdatingVerification}/?redirectUrl=${window.location.href}`,
      );
      if (data.success && data.accountLinkUrl) {
        window.location = data.accountLinkUrl;
      }
    } catch (e) {
      alert(`sorry we couldn't establish connection with stripe`);
    }
  };

  redirectToPaymentSetting = () => {
    switchRoute(ROUTES.CLIENT.MY_PROFILE.paymentSettings);
  };

  chatWithSupportNow = () => {
    if (window.fcWidget && !window.fcWidget.isOpen()) {
      window.fcWidget.open();
    }
  };

  toggleUploadImgModal = () => {
    this.setState({ showUploadImgModal: !this.state.showUploadImgModal });
  };
  render() {
    const {
      isLoggedIn,
      userDetails,
      myStripeAccountDetails,
      isLoadingStripeAccountDetails,
    } = this.props;
    const { showUploadImgModal } = this.state;

    if (!isLoggedIn || isLoadingStripeAccountDetails) {
      return null;
    }

    const istherePaymentDetails = myStripeAccountDetails && myStripeAccountDetails.balanceDetails;
    const areTherePendingPayments =
      istherePaymentDetails &&
      myStripeAccountDetails.balanceDetails.potentialFuturePayouts &&
      myStripeAccountDetails.balanceDetails.potentialFuturePayouts > 0;

    const doesUserHaveAnEstablishedAccId =
      userDetails.stripeConnect && userDetails.stripeConnect.accId;
    const userWithNoStripeConnectAcc = userDetails && !doesUserHaveAnEstablishedAccId;

    if (userWithNoStripeConnectAcc) {
      return (
        <section className="hero is-success is-small is-bold slide-in-top">
          <div className="hero-body">
            <div className="container">
              <h1 style={{ marginBottom: '0.5rem' }} className="subtitle">
                Want to provide your services and earn money?
              </h1>
              <button className="button is-small is-dark" onClick={this.startupTaskerProfile}>
                <span className="icon">
                  <i className="fas fa-user-tie"></i>
                </span>
                <span>START TASKER ONBOARDING</span>
              </button>
              <div className="help has-text-light">*Registration will take ~1 minutes</div>
            </div>
          </div>
        </section>
      );
    }

    const { accRequirements = {}, last4BankAcc } = userDetails.stripeConnect;
    const {
      currently_due = [],
      disabled_reason,
      eventually_due = [],
      past_due = [],
    } = accRequirements;

    const isThereAnUrgentRequirement = past_due.length > 0;
    const areThereMoreRequirement = currently_due.length > 0 || past_due.length > 0;
    const isUserBlocked = !!disabled_reason;

    if (userDetails && areThereMoreRequirement) {
      if (
        currently_due.includes('individual.verification.document') ||
        past_due.includes('individual.verification.document')
      ) {
        return (
          <>
            {showUploadImgModal &&
              ReactDOM.createPortal(
                <div className="modal is-active">
                  <div onClick={this.toggleUploadImgModal} className="modal-background" />
                  <div className="modal-card">
                    <header className="modal-card-head">
                      <div className="modal-card-title">Upload Picture ID</div>
                      <button
                        onClick={this.toggleUploadImgModal}
                        className="delete"
                        aria-label="close"
                      />
                    </header>
                    <section className="modal-card-body">
                      <div className="content">
                        <TaskerSetupForm closeModal={this.toggleUploadImgModal}></TaskerSetupForm>
                      </div>
                    </section>
                  </div>
                </div>,
                document.querySelector('#bidorboo-root-modals'),
              )}
            <section className="hero is-success is-small is-bold slide-in-top">
              <div className="hero-body">
                <div className="container">
                  <h1 style={{ marginBottom: '0.5rem' }} className="subtitle">
                    For faster payouts complete your profile
                  </h1>

                  <button className="button is-small is-dark" onClick={this.toggleUploadImgModal}>
                    <span className="icon">
                      <i className="fas fa-user-tie"></i>
                    </span>
                    <span>Upload ID for verification</span>
                  </button>
                  <div className="help has-text-light">
                    *You will receive our "trusted Tasker" badge which will grant you more tasks
                  </div>
                </div>
              </div>
            </section>
          </>
        );
      } else if (
        currently_due.includes('external_account') ||
        past_due.includes('external_account')
      ) {
        if (userDetails && areTherePendingPayments && !last4BankAcc) {
          return (
            <section className="hero is-success is-small is-bold slide-in-top">
              <div className="hero-body">
                <div className="container">
                  <h1 style={{ marginBottom: '0.5rem' }} className="subtitle">
                    To receive payouts you must add your bank info
                  </h1>
                  <button
                    className="button is-small is-dark"
                    onClick={this.redirectToPaymentSetting}
                  >
                    <span className="icon">
                      <i className="far fa-credit-card" aria-hidden="true" />
                    </span>
                    <span>GO TO PAYOUT SETTINGS</span>
                  </button>
                  <div className="help has-text-light">*Registration will take ~1 minutes</div>
                </div>
              </div>
            </section>
          );
        }
      } else {
        return (
          <section className="hero is-success is-small is-bold slide-in-top">
            <div className="hero-body">
              <div className="container">
                {isThereAnUrgentRequirement ? (
                  <h1 style={{ marginBottom: '0.5rem' }} className="subtitle">
                    Complete your profile to receive payouts
                  </h1>
                ) : (
                  <h1 style={{ marginBottom: '0.5rem' }} className="subtitle">
                    For faster payouts complete your profile
                  </h1>
                )}
                <button className="button is-small is-dark" onClick={this.updateTaskerProfile}>
                  <span className="icon">
                    <i className="fas fa-user-tie"></i>
                  </span>
                  <span>COMPLETE TASKER ONBOARDING</span>
                </button>
                <div className="help has-text-white">
                  *You will receive our "trusted Tasker" badge which will grant you more tasks
                </div>
              </div>
            </div>
          </section>
        );
      }
    }

    // only show this if there is payouts pending
    if (userDetails && areTherePendingPayments && !last4BankAcc) {
      return (
        <section className="hero is-success is-small is-bold slide-in-top">
          <div className="hero-body">
            <div className="container">
              <h1 style={{ marginBottom: '0.5rem' }} className="subtitle">
                To receive payouts you must add your bank info
              </h1>
              <button className="button is-small is-dark" onClick={this.redirectToPaymentSetting}>
                <span className="icon">
                  <i className="far fa-credit-card" aria-hidden="true" />
                </span>
                <span>GO TO PAYOUT SETTINGS</span>
              </button>
              <div className="help has-text-light">*Registration will take ~1 minutes</div>
            </div>
          </div>
        </section>
      );
    }

    if (isUserBlocked) {
      return (
        <section className="hero is-danger is-small is-bold slide-in-top">
          <div className="hero-body">
            <div className="container">
              <h1 style={{ marginBottom: '0.5rem' }} className="subtitle">
                We were not able to verify your info
              </h1>
              <button className="button is-small is-dark" onClick={this.chatWithSupportNow}>
                <span className="icon">
                  <i className="far fa-comment-dots" />
                </span>
                <span>CHAT WITH SUPPORT</span>
              </button>
            </div>
          </div>
        </section>
      );
    }
    return null;
  }
}

const mapStateToProps = ({ userReducer }) => {
  return {
    isLoggedIn: userReducer.isLoggedIn,
    isLoadingStripeAccountDetails: userReducer.isLoadingStripeAccountDetails,
    userDetails: userReducer.userDetails,
    myStripeAccountDetails: userReducer.myStripeAccountDetails,
  };
};

const mapDispatchToProps = (dispatch) => {
  return { getMyStripeAccountDetails: bindActionCreators(getMyStripeAccountDetails, dispatch) };
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskerVerificationBanner);
