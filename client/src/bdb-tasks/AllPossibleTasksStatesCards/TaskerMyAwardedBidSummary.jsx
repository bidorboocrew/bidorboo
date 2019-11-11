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
  SummaryStartDateAndTime,
  BSTaskerAwarded,
  JobCardTitle,
  BSWaitingOnRequesterToConfirm,
  TaskImagesCarousel,
  UserGivenTitle,
} from '../../containers/commonComponents';
import { cancelAwardedBid } from '../../app-state/actions/bidsActions';

import TASKS_DEFINITIONS from '../tasksDefinitions';

class TaskerMyAwardedBidSummary extends React.Component {
  render() {
    const { bid, job, cancelAwardedBid, notificationFeed, updateBidState } = this.props;

    if (!bid || !job || !cancelAwardedBid) {
      return <div>TaskerMyAwardedBidSummary is missing properties</div>;
    }

    const {
      startingDateAndTime,
      addressText,
      isPastDue,
      isHappeningSoon,
      isHappeningToday,
      jobCompletion = {
        proposerConfirmed: false,
        bidderConfirmed: false,
      },
      taskImages = [],
      jobTitle,
    } = job;
    if (
      !startingDateAndTime ||
      !addressText ||
      isHappeningSoon === 'undefined' ||
      isHappeningToday === 'undefined' ||
      isPastDue === 'undefined'
    ) {
      return <div>TaskerMyAwardedBidSummary is missing properties</div>;
    }
    const { TITLE, ICON, IMG } = TASKS_DEFINITIONS[`${job.templateId}`];
    if (!TITLE) {
      return <div>TaskerMyAwardedBidSummary is missing properties</div>;
    }
    const { displayStatus, bidAmount, _id } = bid;
    if (!displayStatus || !bidAmount || !_id) {
      return <div>TaskerMyAwardedBidSummary is missing properties</div>;
    }

    const { proposerConfirmed, bidderConfirmed } = jobCompletion;

    return (
      <React.Fragment>
        <div
          style={{ border: '1px solid #26ca70' }}
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

              {bidderConfirmed && !proposerConfirmed && <BSWaitingOnRequesterToConfirm />}

              {!bidderConfirmed && !proposerConfirmed && <BSTaskerAwarded isPastDue={isPastDue} />}
            </div>
          </div>
          {renderFooter({ bid, isPastDue, jobCompletion, notificationFeed, updateBidState })}
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
)(TaskerMyAwardedBidSummary);

const renderFooter = ({ bid, notificationFeed, updateBidState }) => {
  let newUnseenState = false;
  if (notificationFeed && notificationFeed.myBidsWithNewStatus) {
    for (let i = 0; i < notificationFeed.myBidsWithNewStatus.length; i++) {
      if (notificationFeed.myBidsWithNewStatus[i]._id === bid._id) {
        newUnseenState = true;
        break;
      }
    }
  }
  return (
    <React.Fragment>
      <div className="centeredButtonInCard">
        <a
          style={{ position: 'relative' }}
          onClick={(e) => {
            e.preventDefault();
            newUnseenState && updateBidState(bid._id, 'AWARDED_SEEN');

            switchRoute(
              ROUTES.CLIENT.BIDDER.dynamicReviewMyAwardedBidAndTheRequestDetails(bid._id),
            );
          }}
          className="button is-success"
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
    </React.Fragment>
  );
};
