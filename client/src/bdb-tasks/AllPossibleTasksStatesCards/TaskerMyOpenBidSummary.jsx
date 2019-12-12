import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { proposerConfirmsJobCompletion, cancelJobById } from '../../app-state/actions/jobActions';
import { showLoginDialog } from '../../app-state/actions/uiActions';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';
import {
  CountDownComponent,
  SummaryStartDateAndTime,
  BSawaitingOnRequester,
  BSPastDueExpired,
  JobCardTitle,
  BSAwardedToSomeoneElse,
  TaskImagesCarousel,
  UserGivenTitle,
  TaskerWillEarn,
} from '../../containers/commonComponents';
import { getChargeDistributionDetails } from '../../containers/commonUtils';

import TASKS_DEFINITIONS from '../tasksDefinitions';
import { REQUEST_STATES } from '../index';

class TaskerMyOpenBidSummary extends React.Component {
  render() {
    const { bid, job, otherArgs } = this.props;
    if (!bid || !job || !otherArgs) {
      return <div>TaskerMyOpenBidSummary is missing properties</div>;
    }

    const { deleteOpenBid } = otherArgs;
    if (!deleteOpenBid) {
      return <div>TaskerMyOpenBidSummary is missing properties</div>;
    }

    const { startingDateAndTime, location, isPastDue, state, taskImages = [], jobTitle } = job;
    if (!startingDateAndTime || !location || isPastDue === 'undefined') {
      return <div>TaskerMyOpenBidSummary is missing properties</div>;
    }
    const { coordinates } = location;
    if (!coordinates) {
      return <div>TaskerMyOpenBidSummary is missing properties</div>;
    }
    const { bidAmount, isNewBid } = bid;

    if (!bidAmount) {
      return <div>TaskerMyOpenBidSummary is missing properties</div>;
    }

    const { displayStatus } = bid;
    if (!displayStatus) {
      return <div>TaskerMyOpenBidSummary is missing properties</div>;
    }

    const { TITLE, ICON, IMG } = TASKS_DEFINITIONS[`${job.templateId}`];
    if (!TITLE) {
      return <div>TaskerMyOpenBidSummary is missing properties</div>;
    }

    const isAwardedToSomeoneElse =
      state === REQUEST_STATES.AWARDED && bid._id !== job._awardedBidRef;
    const { value: bidValue, currency: bidCurrency } = bidAmount;
    const { taskerTotalPayoutAmount } = getChargeDistributionDetails(bidValue);

    return (
      <div className={`card has-text-centered cardWithButton`}>
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
            <TaskerWillEarn earningAmount={taskerTotalPayoutAmount}></TaskerWillEarn>

            {isAwardedToSomeoneElse && <BSAwardedToSomeoneElse />}

            {!isAwardedToSomeoneElse && (
              <React.Fragment>
                {isPastDue && <BSPastDueExpired />}
                {!isPastDue && <BSawaitingOnRequester />}
              </React.Fragment>
            )}
          </div>
        </div>
        {renderFooter({ bid, isPastDue, isAwardedToSomeoneElse, isNewBid })}
      </div>
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
    cancelJobById: bindActionCreators(cancelJobById, dispatch),
    showLoginDialog: bindActionCreators(showLoginDialog, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskerMyOpenBidSummary);

const renderFooter = ({ bid, isPastDue, isAwardedToSomeoneElse, isNewBid }) => {
  if (isAwardedToSomeoneElse) {
    return null;
  } else if (isPastDue) {
    return null;
  } else if (!isPastDue && !isAwardedToSomeoneElse && isNewBid) {
    return (
      <div className="centeredButtonInCard">
        <a
          onClick={() => {
            switchRoute(ROUTES.CLIENT.BIDDER.dynamicReviewMyOpenBidAndTheRequestDetails(bid._id));
          }}
          className={`button is-fullwidth is-info`}
        >
          <span>Change my bid</span>
        </a>
      </div>
    );
  } else if (!isPastDue && !isAwardedToSomeoneElse && !isNewBid) {
    return (
      <div className="centeredButtonInCard">
        <a
          onClick={() => {
            switchRoute(ROUTES.CLIENT.BIDDER.dynamicReviewMyOpenBidAndTheRequestDetails(bid._id));
          }}
          className={`button is-fullwidth is-info`}
        >
          <span>View Details</span>
        </a>
      </div>
    );
  }
};
