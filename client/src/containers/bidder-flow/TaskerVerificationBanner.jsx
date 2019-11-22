import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';

class TaskerVerificationBanner extends React.Component {
  startupTaskerProfile = async () => {
    try {
      const { data } = await axios.get(ROUTES.API.PAYMENT.GET.accountLinkForSetupAndVerification);
      if (data.success && data.accountLinkUrl) {
        window.location = data.accountLinkUrl;
      }
    } catch (e) {
      alert(`sorry we couldn't establish connection with stripe`);
    }
  };

  render() {
    const { isLoggedIn, userDetails } = this.props;
    const taskerCanBid = userDetails && userDetails.canBid;

    return isLoggedIn && !taskerCanBid ? (
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
              <span>COMPLETE TASKER ONBOARDING</span>
            </button>
            <div className="help has-text-light">*Registration will take ~1 minutes</div>
          </div>
        </div>
      </section>
    ) : null;
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
