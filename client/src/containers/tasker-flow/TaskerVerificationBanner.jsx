import React from 'react';
import ReactDOM from 'react-dom';

import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getMyStripeAccountDetails } from '../../app-state/actions/paymentActions';
import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';
import TaskerSetupForm from '../../components/forms/TaskerSetupForm';
import * as A from '../../app-state/actionTypes';
import { getBugsnagClient } from '../../index';

class TaskerVerificationBanner extends React.Component {
  constructor(props) {
    super(props);

    this.state = { showUploadImgModal: false, isLoading: false };
  }
  componentDidMount() {
    const { isLoggedIn } = this.props;

    isLoggedIn && this.props.getMyStripeAccountDetails();
  }

  startupTaskerProfile = async () => {
    const { dispatch } = this.props;
    this.setState({ isLoading: true }, async () => {
      try {
        const { data } = await axios.get(
          `${ROUTES.API.PAYMENT.GET.accountLinkForSetupAndVerification}/?redirectUrl=${window.location.href}`,
        );
        if (data.success && data.accountLinkUrl) {
          window.location = data.accountLinkUrl;
        }
      } catch (e) {
        getBugsnagClient().leaveBreadcrumb('sorry we couldnt establish connection with stripe');
        getBugsnagClient().notify(e);
        dispatch({
          type: A.UI_ACTIONS.SHOW_TOAST_MSG,
          payload: {
            toastDetails: {
              type: 'error',
              msg: `sorry we couldn't establish connection with stripe, try again later or `,
            },
          },
        });
      }
    });
  };

  updateTaskerProfile = async () => {
    this.setState({ isLoading: true }, async () => {
      try {
        const { data } = await axios.get(
          `${ROUTES.API.PAYMENT.GET.accountLinkForUpdatingVerification}/?redirectUrl=${window.location.href}`,
        );
        if (data.success && data.accountLinkUrl) {
          window.location = data.accountLinkUrl;
        }
      } catch (e) {
        getBugsnagClient().leaveBreadcrumb(
          'updateTaskerProfile, sorry we couldnt establish connection with stripe',
        );
        getBugsnagClient().notify(e);
      }
    });
  };

  redirectToPaymentSetting = () => {
    switchRoute(ROUTES.CLIENT.MY_PROFILE.paymentSettings);
  };

  chatWithSupportNow = () => {
    if (window.fcWidget && !window.fcWidget.isOpen()) {
      document.querySelector('#bob-ChatSupport') &&
        document.querySelector('#bob-ChatSupport').click();
      // window.fcWidget.open();
    }
  };

  toggleUploadImgModal = () => {
    this.setState({ showUploadImgModal: !this.state.showUploadImgModal });
  };

  render() {
    const { isLoggedIn, userDetails, isLoadingStripeAccountDetails } = this.props;
    const { showUploadImgModal, isLoading } = this.state;

    if (!isLoggedIn || !userDetails || !userDetails.userId || isLoadingStripeAccountDetails) {
      return null;
    }

    let canBid = !!userDetails.canBid;
    if (canBid) {
      return null;
    }

    const { accRequirements = {} } = userDetails.stripeConnect;
    const {
      currently_due = [],

      // eventually_due = [],
      past_due = [],
    } = accRequirements;

    const areThereMoreRequirement = currently_due.length > 0 || past_due.length > 0;

    const showAddVerificationId =
      areThereMoreRequirement &&
      (currently_due.includes('individual.verification.document') ||
        past_due.includes('individual.verification.document'));

    if (showAddVerificationId) {
      return (
        <>
          {showUploadImgModal &&
            ReactDOM.createPortal(
              <div className="modal is-active">
                <div onClick={this.toggleUploadImgModal} className="modal-background" />
                <div className="modal-card">
                  <header className="modal-card-head">
                    <div className="modal-card-title">Upload Verification ID</div>
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
          <section
            id="bob-taskerVerificationBanner"
            className="hero is-success is-bold slide-in-top has-text-centered is-fullheight"
          >
            <div className="hero-body">
              <div className="container">
                <h1 className="title">Want to earn money?</h1>
                <h1 className="subtitle">
                  For Safety reasons as a Tasker you are required to provide a valid ID
                </h1>
                <button
                  className={`button is-dark ${isLoading ? 'is-loading' : ''}`}
                  onClick={this.toggleUploadImgModal}
                >
                  <span className="icon">
                    <i className="fas fa-user-tie"></i>
                  </span>
                  <span>Complete ID Verification</span>
                </button>
                <div className="help has-text-light">
                  A "Trusted Tasker" badge will appear on your profile
                </div>
              </div>
            </div>
          </section>
        </>
      );
    }

    const showAddExternalBankAcc =
      (currently_due.length === 1 && currently_due.includes('external_account')) ||
      (past_due.length === 1 && past_due.includes('external_account')) ||
      currently_due.includes('external_account');
    if (showAddExternalBankAcc) {
      return null;
      // we dont wana bug them too much, we will do that later if you have outstanding payouts
      return (
        <section
          id="bob-taskerVerificationBanner"
          className="hero is-success is-bold slide-in-top has-text-centered is-fullheight"
        >
          <div className="hero-body">
            <div className="container">
              <h1 className="title">Want to earn money?</h1>
              <h1 className="subtitle">
                In order to Bid and recieve Payouts, You must complete the Tasker Verifications
                process
              </h1>
              <button
                className={`button is-dark ${isLoading ? 'is-loading' : ''}`}
                onClick={this.redirectToPaymentSetting}
              >
                <span className="icon">
                  <i className="far fa-credit-card" aria-hidden="true" />
                </span>
                <span>Add Bank Info</span>
              </button>
              <div className="help has-text-light">*This will redirect you to payments page</div>
            </div>
          </div>
        </section>
      );
    }

    if (areThereMoreRequirement) {
      return (
        <section
          id="bob-taskerVerificationBanner"
          className="hero is-success is-bold slide-in-top has-text-centered is-fullheight"
        >
          <div className="hero-body">
            <div className="container">
              <h1 className="title">Want to earn money?</h1>
              <h1 className="subtitle">
                In order to Bid and recieve Payouts, You must complete the Tasker Verifications
                process
              </h1>

              <button
                className={`button is-dark ${isLoading ? 'is-loading' : ''}`}
                onClick={this.updateTaskerProfile}
              >
                <span className="icon">
                  <i className="fas fa-user-tie"></i>
                </span>
                <span>Complete Verification Process</span>
              </button>
              <div className="help has-text-white">
                A "Trusted Tasker" badge will appear on your profile
              </div>
            </div>
          </div>
        </section>
      );
    }

    // we dont know why
    return (
      <section
        id="bob-taskerVerificationBanner"
        className="hero is-success is-bold slide-in-top has-text-centered is-fullheight"
      >
        <div className="hero-body">
          <div className="container">
            <h1 className="title">You are not a verified Tasker Yet!</h1>
            <h1 className="subtitle">Don't worry, we just need a little more details</h1>
            <button
              className={`button is-dark ${isLoading ? 'is-loading' : ''}`}
              onClick={this.chatWithSupportNow}
            >
              <span className="icon">
                <i className="far fa-comment-dots" />
              </span>
              <span>Chat with Support</span>
            </button>
          </div>
        </div>
      </section>
    );
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
  return {
    dispatch,
    getMyStripeAccountDetails: bindActionCreators(getMyStripeAccountDetails, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskerVerificationBanner);
