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

    this.state = { showUploadImgModal: false, isLoading: false };
  }
  componentDidMount() {
    const { isLoggedIn } = this.props;

    isLoggedIn && this.props.getMyStripeAccountDetails();
  }

  startupTaskerProfile = async () => {
    this.setState({ isLoading: true }, async () => {
      try {
        const { data } = await axios.get(
          `${ROUTES.API.PAYMENT.GET.accountLinkForSetupAndVerification}/?redirectUrl=${window.location.href}`,
        );
        if (data.success && data.accountLinkUrl) {
          window.location = data.accountLinkUrl;
        }
      } catch (e) {
        console.error(`sorry we couldn't establish connection with stripe`);
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
        console.error(`sorry we couldn't establish connection with stripe`);
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

    if (!isLoggedIn || isLoadingStripeAccountDetails) {
      return null;
    }

    const doesUserHaveAnEstablishedAccId =
      userDetails.stripeConnect && userDetails.stripeConnect.accId;
    const userWithNoStripeConnectAcc = userDetails && !doesUserHaveAnEstablishedAccId;

    if (userWithNoStripeConnectAcc) {
      return (
        <section className="hero is-success is-bold slide-in-top has-text-centered is-fullheight">
          <div className="hero-body">
            <div className="container">
              <h1 style={{ marginBottom: '0.5rem' }} className="title">
                Want to earn money doing what you enjoy?
              </h1>
              <button
                className={`button is-dark ${isLoading ? 'is-loading' : ''}`}
                onClick={this.startupTaskerProfile}
              >
                <span className="icon">
                  <i className="fas fa-user-tie"></i>
                </span>
                <span>BECOME A TASKER</span>
              </button>
              <div className="help has-text-light">will take less than 2 minutes</div>
            </div>
          </div>
        </section>
      );
    }

    const { accRequirements = {}, last4BankAcc } = userDetails.stripeConnect;
    const {
      currently_due = [],
      disabled_reason,
      // eventually_due = [],
      past_due = [],
    } = accRequirements;

    const isThereAnUrgentRequirement = past_due.length > 0;
    const areThereMoreRequirement = currently_due.length > 0 || past_due.length > 0;
    const isUserBlocked = !!disabled_reason;

    const showAddBankInfo =
      (currently_due.includes('external_account') || past_due.includes('external_account')) &&
      !last4BankAcc;

    const showAddVerificationId =
      currently_due.includes('individual.verification.document') ||
      past_due.includes('individual.verification.document');

    if (areThereMoreRequirement) {
      if (showAddVerificationId) {
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
            <section className="hero is-success is-bold slide-in-top has-text-centered is-fullheight">
              <div className="hero-body">
                <div className="container">
                  <h1 style={{ marginBottom: '0.5rem' }} className="title">
                    Increast Trust and Get Faster Payouts
                  </h1>
                  <h1 style={{ marginBottom: '0.5rem' }} className="subtitle">
                    For Safety reasons as a Tasker you are required to provide a valid ID
                  </h1>
                  <button
                    className={`button is-dark ${isLoading ? 'is-loading' : ''}`}
                    onClick={this.toggleUploadImgModal}
                  >
                    <span className="icon">
                      <i className="fas fa-user-tie"></i>
                    </span>
                    <span>ID VERIFICATION</span>
                  </button>
                  <div className="help has-text-light">
                    A "Trusted Tasker" badge will appear on your profile
                  </div>
                </div>
              </div>
            </section>
          </>
        );
      } else if (showAddBankInfo) {
        // we dont wana bug them too much
        return null;
        // return (
        //   <section className="hero is-success is-bold slide-in-top">
        //     <div className="hero-body">
        //       <div className="container">
        //         <h1 style={{ marginBottom: '0.5rem' }} className="subtitle">
        //           To receive payouts you must add your bank info
        //         </h1>
        //         <button
        //           className={`button is-dark ${isLoading ? 'is-loading' : ''}`}
        //           onClick={this.redirectToPaymentSetting}
        //         >
        //           <span className="icon">
        //             <i className="far fa-credit-card" aria-hidden="true" />
        //           </span>
        //           <span>ADD A PAYOUT ACCOUNT</span>
        //         </button>
        //         <div className="help has-text-light">*This will redirect you to payouts page</div>
        //       </div>
        //     </div>
        //   </section>
        // );
      } else {
        return (
          <section className="hero is-success is-bold slide-in-top has-text-centered is-fullheight">
            <div className="hero-body">
              <div className="container">
                {isThereAnUrgentRequirement ? (
                  <h1 style={{ marginBottom: '0.5rem' }} className="subtitle">
                    Complete Your Tasker Profile To Receive Payouts
                  </h1>
                ) : (
                  <h1 style={{ marginBottom: '0.5rem' }} className="subtitle">
                    Complete Your Tasker Profile To Receive Payouts
                  </h1>
                )}
                <button
                  className={`button is-dark ${isLoading ? 'is-loading' : ''}`}
                  onClick={this.updateTaskerProfile}
                >
                  <span className="icon">
                    <i className="fas fa-user-tie"></i>
                  </span>
                  <span>UPDATE YOUR PROFILE</span>
                </button>
                <div className="help has-text-white">
                  A "Trusted Tasker" badge will appear on your profile
                </div>
              </div>
            </div>
          </section>
        );
      }
    }

    if (isUserBlocked) {
      return (
        <section className="hero is-success is-bold slide-in-top has-text-centered is-fullheight">
          <div className="hero-body">
            <div className="container">
              <h1 style={{ marginBottom: '0.5rem' }} className="title">
                Sorry, It Seems We Need More Details
              </h1>
              <h1 style={{ marginBottom: '0.5rem' }} className="subtitle">
                Contact us and we will help you to become an eligible tasker
              </h1>
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
  return {
    dispatch,
    getMyStripeAccountDetails: bindActionCreators(getMyStripeAccountDetails, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskerVerificationBanner);
