import React from 'react';

import BidModal from './BidModal';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
import { AnytimeQuickModal } from '../../containers/commonComponents.jsx';

export default class PostYourBid extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showBidDialog: false,
    };
  }
  closeShowBidDialog = () => {
    this.setState({ showBidDialog: false });
  };

  openShowBidDialog = () => {
    const { isLoggedIn, showLoginDialog, taskerCanBid } = this.props;

    if (!isLoggedIn) {
      showLoginDialog(true);
    } else if (!taskerCanBid) {
      this.toggleShowQuickModal(true);

      // alert('complete the tasker onBoarding before you can bid');
    } else {
      this.setState({ showBidDialog: true });
    }
  };

  toggleShowQuickModal = (val) => {
    this.setState({ showTaskerOnBoardingDialog: val });
  };
  render() {
    const { showBidDialog, showTaskerOnBoardingDialog } = this.state;

    return (
      <>
        {showTaskerOnBoardingDialog && (
          <AnytimeQuickModal
            showModal={showTaskerOnBoardingDialog}
            setShowModal={this.toggleShowQuickModal}
            title={'Tasker Onboarding'}
            renderContentFunc={() => (
              <div className="container">
                <p>Before you bid you must complete our tasker onboarding.</p>
                <button
                  className="button is-small is-dark"
                  onClick={() => {
                    switchRoute(ROUTES.CLIENT.MY_PROFILE.paymentSettings);
                  }}
                >
                  <span className="icon">
                    <i className="fas fa-user-tie"></i>
                  </span>
                  <span>Start Onboarding</span>
                </button>
                <div className="help">*Registration will take ~5 minutes</div>
              </div>
            )}
          />
        )}
        <div className="centeredButtonInCard">
          <button
            onClick={this.openShowBidDialog}
            type="button"
            id="bob-bid-on-request"
            className={`button is-success is-medium`}
          >
            <span className="icon">
              <i className="fas fa-hand-paper" />
            </span>
            <span>Enter Your Bid</span>
          </button>
          {showBidDialog && <BidModal {...this.props} handleClose={this.closeShowBidDialog} />}
        </div>
      </>
    );
  }
}
