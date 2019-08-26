import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { proposerConfirmsJobCompletion } from '../../app-state/actions/jobActions';
import { showLoginDialog } from '../../app-state/actions/uiActions';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';
import {
  CountDownComponent,
  TaskIsFulfilled,
  JobCardTitle,
  SummaryStartDateAndTime,
  ArchiveTask,
  TaskImagesCarousel,
} from '../../containers/commonComponents';
import { cancelAwardedBid } from '../../app-state/actions/bidsActions';

import TASKS_DEFINITIONS from '../tasksDefinitions';

class TaskerMyAwardedDoneBidSummary extends React.Component {
  render() {
    const { bid, job, cancelAwardedBid } = this.props;
    if (!bid || !job || !cancelAwardedBid) {
      return <div>TaskerMyAwardedDoneBidSummary missing properties</div>;
    }

    const {
      startingDateAndTime,
      addressText,
      isPastDue,
      isHappeningSoon,
      isHappeningToday,
      _reviewRef = {
        revealToBoth: false,
        requiresProposerReview: true,
        requiresBidderReview: true,
      },
      taskImages = [],
    } = job;
    if (
      !startingDateAndTime ||
      !addressText ||
      isHappeningSoon === 'undefined' ||
      isHappeningToday === 'undefined' ||
      isPastDue === 'undefined'
    ) {
      return <div>TaskerMyAwardedDoneBidSummary missing properties</div>;
    }
    const { TITLE, ICON, IMG } = TASKS_DEFINITIONS[`${job.templateId}`];
    if (!TITLE) {
      return <div>TaskerMyAwardedDoneBidSummary missing properties</div>;
    }
    const { displayStatus, bidAmount, _id } = bid;
    if (!displayStatus || !bidAmount || !_id) {
      return <div>TaskerMyAwardedDoneBidSummary missing properties</div>;
    }
    // xxx get currency from processed payment
    const { value: bidValue, currency: bidCurrency } = bidAmount;
    if (!bidValue || !bidCurrency) {
      return <div>TaskerMyAwardedDoneBidSummary missing properties</div>;
    }

    const { revealToBoth, requiresProposerReview, requiresBidderReview } = _reviewRef;

    return (
      <div className={`card has-text-centered cardWithButton`}>
        <div className="card-content">
          <div className="content">
            <JobCardTitle icon={ICON} title={TITLE} img={IMG} />
            <TaskImagesCarousel taskImages={taskImages} />
            <SummaryStartDateAndTime
              date={startingDateAndTime}
              renderHelpComponent={() => (
                <CountDownComponent startingDate={startingDateAndTime} isJobStart={false} />
              )}
            />

            {!requiresBidderReview && <ArchiveTask />}

            {requiresBidderReview && <TaskIsFulfilled />}
          </div>
        </div>
        {requiresBidderReview && (
          <div className="centeredButtonInCard">
            <a
              onClick={() => {
                switchRoute(
                  ROUTES.CLIENT.BIDDER.dynamicReviewMyAwardedBidAndTheRequestDetails(bid._id),
                );
              }}
              className={`button is-primary`}
            >
              VIEW DETAILS
            </a>
          </div>
        )}
        {!requiresBidderReview && (
          <div className="centeredButtonInCard">
            <a
              onClick={() => {
                switchRoute(
                  ROUTES.CLIENT.BIDDER.dynamicReviewMyAwardedBidAndTheRequestDetails(bid._id),
                );
              }}
              className={`button is-dark`}
            >
              Archived
            </a>
          </div>
        )}
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
    cancelAwardedBid: bindActionCreators(cancelAwardedBid, dispatch),
    showLoginDialog: bindActionCreators(showLoginDialog, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TaskerMyAwardedDoneBidSummary);
