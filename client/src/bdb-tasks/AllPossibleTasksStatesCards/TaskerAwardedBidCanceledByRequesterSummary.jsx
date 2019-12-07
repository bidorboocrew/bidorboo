import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { proposerConfirmsJobCompletion } from '../../app-state/actions/jobActions';
import { showLoginDialog } from '../../app-state/actions/uiActions';
import { updateBidState } from '../../app-state/actions/bidsActions';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';
import {
  CountDownComponent,
  JobCardTitle,
  CancelledBy,
  SummaryStartDateAndTime,
  TaskImagesCarousel,
  UserGivenTitle,
  TaskerWillEarn,
} from '../../containers/commonComponents';
import { cancelAwardedBid } from '../../app-state/actions/bidsActions';
import { getChargeDistributionDetails } from '../../containers/commonUtils';

import TASKS_DEFINITIONS from '../tasksDefinitions';

class TaskerAwardedBidCanceledByTaskerSummary extends React.Component {
  render() {
    const { bid, job, notificationFeed, updateBidState } = this.props;
    if (!bid || !job) {
      return <div>TaskerAwardedBidCanceledByTaskerSummary is missing properties</div>;
    }

    const { startingDateAndTime, taskImages = [], jobTitle } = job;
    if (!startingDateAndTime) {
      return <div>TaskerAwardedBidCanceledByTaskerSummary is missing properties</div>;
    }
    const { TITLE, ICON, IMG } = TASKS_DEFINITIONS[`${job.templateId}`];
    if (!TITLE) {
      return <div>TaskerAwardedBidCanceledByTaskerSummary is missing properties</div>;
    }
    const { displayStatus, bidAmount, _id } = bid;
    if (!displayStatus || !bidAmount || !_id) {
      return <div>TaskerAwardedBidCanceledByTaskerSummary is missing properties</div>;
    }
    const { value: bidValue, currency: bidCurrency } = bidAmount;
    if (!bidValue || !bidCurrency) {
      return <div>TaskerAwardedBidCanceledByTaskerSummary is missing properties</div>;
    }

    let newUnseenState = false;
    if (notificationFeed && notificationFeed.myBidsWithNewStatus) {
      for (let i = 0; i < notificationFeed.myBidsWithNewStatus.length; i++) {
        if (notificationFeed.myBidsWithNewStatus[i]._id === bid._id) {
          newUnseenState = true;
          break;
        }
      }
    }
    const { taskerPayoutInCaseOfPartialRefund } = getChargeDistributionDetails(bidValue);

    return (
      <React.Fragment>
        <div
          style={{ border: '1px solid #ee2a36' }}
          className={`card has-text-centered cardWithButton`}
        >
          <div className="card-content">
            <div className="content">
              <JobCardTitle icon={ICON} title={TITLE} img={IMG} />
              <UserGivenTitle userGivenTitle={jobTitle} />

              <TaskImagesCarousel taskImages={taskImages} />
              <SummaryStartDateAndTime
                date={startingDateAndTime}
                renderHelpComponent={() => (
                  <CountDownComponent startingDate={startingDateAndTime} isJobStart={false} />
                )}
              />
              <TaskerWillEarn earningAmount={taskerPayoutInCaseOfPartialRefund}></TaskerWillEarn>

              <CancelledBy name="Requester" />
            </div>
          </div>
          <div className="centeredButtonInCard">
            <a
              style={{ position: 'relative' }}
              onClick={(e) => {
                e.preventDefault();
                newUnseenState && updateBidState(bid._id, 'AWARDED_BID_CANCELED_BY_REQUESTER_SEEN');

                switchRoute(
                  ROUTES.CLIENT.BIDDER.dynamicReviewMyAwardedBidAndTheRequestDetails(bid._id),
                );
              }}
              className="button is-danger"
            >
              {newUnseenState && (
                <div
                  style={{ position: 'absolute', top: -5, right: 0, fontSize: 10 }}
                  className="has-text-danger"
                >
                  <i className="fas fa-circle" />
                </div>
              )}
              VIEW DETAILS
            </a>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ jobsReducer, userReducer, uiReducer }) => {
  return {
    isLoggedIn: userReducer.isLoggedIn,
    selectedAwardedJob: jobsReducer.selectedAwardedJob,
    userDetails: userReducer.userDetails,
    notificationFeed: uiReducer.notificationFeed,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    proposerConfirmsJobCompletion: bindActionCreators(proposerConfirmsJobCompletion, dispatch),
    cancelAwardedBid: bindActionCreators(cancelAwardedBid, dispatch),
    showLoginDialog: bindActionCreators(showLoginDialog, dispatch),
    updateBidState: bindActionCreators(updateBidState, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TaskerAwardedBidCanceledByTaskerSummary);

const renderFooter = ({ bid }) => {
  return <div style={{ padding: '0 0.5rem 0.5rem 0.5rem' }} />;
};
