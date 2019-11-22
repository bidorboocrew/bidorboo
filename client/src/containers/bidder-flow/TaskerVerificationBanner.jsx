import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';

class TaskerVerificationBanner extends React.Component {
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
  render() {
    const { isLoggedIn, userDetails } = this.props;

    if (!isLoggedIn) {
      return null;
    }

    if (userDetails && !userDetails.stripeConnect) {
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
    const areThereMoreRequirement =
      currently_due.length > 0 || eventually_due.length > 0 || past_due.length > 0;
    const isUserBlocked = !!disabled_reason;

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

    if (userDetails && !last4BankAcc) {
      return (
        <section className="hero is-success is-small is-bold slide-in-top">
          <div className="hero-body">
            <div className="container">
              <h1 style={{ marginBottom: '0.5rem' }} className="subtitle">
                To recieve payouts you must add your bank info
              </h1>
              <button className="button is-small is-dark" onClick={this.redirectToPaymentSetting}>
                <span className="icon">
                  <i className="far fa-credit-card" aria-hidden="true" />
                </span>
                <span>GO TO PAYMENT SETTINGS</span>
              </button>
              <div className="help has-text-light">*Registration will take ~1 minutes</div>
            </div>
          </div>
        </section>
      );
    }

    if (userDetails && last4BankAcc) {
      return areThereMoreRequirement ? (
        <section className="hero is-success is-small is-bold slide-in-top">
          <div className="hero-body">
            <div className="container">
              {isThereAnUrgentRequirement ? (
                <h1 style={{ marginBottom: '0.5rem' }} className="subtitle">
                  You Must Complete your profile to receive payouts
                </h1>
              ) : (
                <h1 style={{ marginBottom: '0.5rem' }} className="subtitle">
                  Complete your profile for faster payouts
                </h1>
              )}
              <button className="button is-small is-dark" onClick={this.updateTaskerProfile}>
                <span className="icon">
                  <i className="fas fa-user-tie"></i>
                </span>
                <span>COMPLETE TASKER ONBOARDING</span>
              </button>
            </div>
          </div>
        </section>
      ) : null;
    }
  }
}

const mapStateToProps = ({ bidsReducer, uiReducer, userReducer }) => {
  return {
    isLoggedIn: userReducer.isLoggedIn,
    userDetails: userReducer.userDetails,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskerVerificationBanner);
