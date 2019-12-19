import React from 'react';

import BidModal from './BidModal';

// import { AnytimeQuickModal } from '../../containers/commonComponents.jsx';
// import TaskerVerificationBanner from '../../containers/tasker-flow/TaskerVerificationBanner.jsx';
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
    }
    //  else if (!taskerCanBid) {
    //   this.toggleShowTaskerOnBoardingDialog(true);

    //   // alert('complete the tasker onBoarding before you can bid');
    // }
    else {
      this.setState({ showBidDialog: true });
    }
    // this.setState({ showBidDialog: true });
  };

  toggleShowTaskerOnBoardingDialog = (val) => {
    this.setState({ showTaskerOnBoardingDialog: val });
  };
  render() {
    const { showBidDialog, showTaskerOnBoardingDialog } = this.state;

    return (
      <>
        {/* {showTaskerOnBoardingDialog && (
          <AnytimeQuickModal
            showModal={showTaskerOnBoardingDialog}
            setShowModal={this.toggleShowTaskerOnBoardingDialog}
            title={'Tasker Onboarding'}
            renderContentFunc={() => <TaskerVerificationBanner></TaskerVerificationBanner>}
          />
        )} */}
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
