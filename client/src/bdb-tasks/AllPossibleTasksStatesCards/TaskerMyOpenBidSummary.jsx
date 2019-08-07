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
} from '../../containers/commonComponents';

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

    const { startingDateAndTime, location, isPastDue, state } = job;
    if (!startingDateAndTime || !location || isPastDue === 'undefined') {
      return <div>TaskerMyOpenBidSummary is missing properties</div>;
    }
    const { coordinates } = location;
    if (!coordinates) {
      return <div>TaskerMyOpenBidSummary is missing properties</div>;
    }
    const { bidAmount } = bid;
    if (!bidAmount) {
      return <div>TaskerMyOpenBidSummary is missing properties</div>;
    }
    const { value: bidValue, currency: bidCurrency } = bidAmount;
    if (!bidValue || !bidCurrency) {
      return <div>TaskerMyOpenBidSummary is missing properties</div>;
    }

    const { displayStatus } = bid;
    if (!displayStatus) {
      return <div>TaskerMyOpenBidSummary is missing properties</div>;
    }

    const { TITLE, ICON } = TASKS_DEFINITIONS[`${job.templateId}`];
    if (!TITLE) {
      return <div>TaskerMyOpenBidSummary is missing properties</div>;
    }

    const isAwardedToSomeoneElse = state === REQUEST_STATES.AWARDED;

    return (
      <div className={`card has-text-centered cardWithButton`}>
        <div className="card-content">
          <div className="content">
            <JobCardTitle icon={ICON} title={TITLE} />

            <SummaryStartDateAndTime
              date={startingDateAndTime}
              renderHelpComponent={() => (
                <CountDownComponent startingDate={startingDateAndTime} isJobStart={false} />
              )}
            />

            {isAwardedToSomeoneElse && <BSAwardedToSomeoneElse />}

            {!isAwardedToSomeoneElse && (
              <React.Fragment>
                {isPastDue && <BSPastDueExpired />}
                {!isPastDue && <BSawaitingOnRequester />}
              </React.Fragment>
            )}

            {/* <LocationLabelAndValue location={coordinates} useShortAddress /> */}
          </div>
        </div>
        {renderFooter({ bid, isPastDue, isAwardedToSomeoneElse })}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TaskerMyOpenBidSummary);

const renderFooter = ({ bid, isPastDue, isAwardedToSomeoneElse }) => {
  if (isAwardedToSomeoneElse) {
    return null;
  } else if (isPastDue) {
    return null;
  } else if (!isPastDue && !isAwardedToSomeoneElse) {
    return (
      <div className="centeredButtonInCard">
        <a
          onClick={() => {
            switchRoute(ROUTES.CLIENT.BIDDER.dynamicReviewMyOpenBidAndTheRequestDetails(bid._id));
          }}
          className={`button is-fullwidth ${isPastDue ? '' : 'is-info'}`}
        >
          <span>Change My Bid</span>
        </a>
      </div>
    );
  }
};
