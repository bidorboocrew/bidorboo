import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { proposerConfirmsJobCompletion } from '../../app-state/actions/jobActions';
import { showLoginDialog } from '../../app-state/actions/uiActions';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';
import {
  CountDownComponent,
  StartDateAndTime,
  DisplayShortAddress,
  JobCardTitle,
} from '../../containers/commonComponents';
import { cancelAwardedBid } from '../../app-state/actions/bidsActions';

import TASKS_DEFINITIONS from '../tasksDefinitions';

class TaskerMyAwardedBidSummary extends React.Component {
  render() {
    const { bid, job, cancelAwardedBid } = this.props;

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
        bidderDisputed: false,
        proposerDisputed: false,
      },
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
    const { TITLE, ICON } = TASKS_DEFINITIONS[`${job.templateId}`];
    if (!TITLE) {
      return <div>TaskerMyAwardedBidSummary is missing properties</div>;
    }
    const { displayStatus, bidAmount, _id } = bid;
    if (!displayStatus || !bidAmount || !_id) {
      return <div>TaskerMyAwardedBidSummary is missing properties</div>;
    }
    // xxx get currency from processed payment
    const { value: bidValue, currency: bidCurrency } = bidAmount;
    if (!bidValue || !bidCurrency) {
      return <div>TaskerMyAwardedBidSummary is missing properties</div>;
    }

    const { proposerConfirmed, bidderConfirmed } = jobCompletion;

    return (
      <React.Fragment>
        <div className={`card has-text-centered cardWithButton`}>
          <div className="card-content">
            <div className="content">
              <JobCardTitle icon={ICON} title={TITLE} />

              {bidderConfirmed && !proposerConfirmed && (
                <div className="group">
                  <label className="label">Request Status</label>
                  <div className="control has-text-success">Pending Confirmation</div>

                  <div className="help">
                    * Awaiting on the requester to confirm this request is completed. this shouldn't
                    take long
                  </div>
                </div>
              )}

              {!bidderConfirmed && !proposerConfirmed && (
                <div className="group">
                  <label className="label">Request Status</label>
                  <div className="control has-text-success">Assigned To Me</div>
                  {!isHappeningSoon && !isHappeningToday && !isPastDue && (
                    <div className="help">
                      * Get In touch with the Requester to confirm any further details
                    </div>
                  )}
                  {isHappeningSoon && !isHappeningToday && !isPastDue && (
                    <div className="help">* Happening soon, Make sure to contact the Tasker</div>
                  )}
                  {isHappeningToday && !isPastDue && (
                    <div className="help">* Happening today, Tasker will show up on time</div>
                  )}
                  {isPastDue && (
                    <div className="help">
                      * This request date is past Due, plz confirm completion
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
          {renderFooter({ bid, isPastDue, jobCompletion })}
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TaskerMyAwardedBidSummary);

const renderFooter = ({ bid, isPastDue, jobCompletion }) => {
  const { proposerConfirmed = false, bidderConfirmed = false } = jobCompletion;

  return (
    <React.Fragment>
      <div className="centeredButtonInCard">
        <a
          style={{ position: 'relative' }}
          onClick={() => {
            switchRoute(
              ROUTES.CLIENT.BIDDER.dynamicReviewMyAwardedBidAndTheRequestDetails(bid._id),
            );
          }}
          className="button is-fullwidth is-success"
        >
          {bidderConfirmed && !proposerConfirmed && <span>View Details</span>}

          {proposerConfirmed && (
            <React.Fragment>
              <span className="icon">
                <i className="fas fa-user-check" />
              </span>
              <span>Review The Requester</span>
            </React.Fragment>
          )}
          {!proposerConfirmed && !bidderConfirmed && (
            <span>{`${isPastDue ? 'Confirm Completion' : 'View Full Details'}`}</span>
          )}
        </a>
      </div>
    </React.Fragment>
  );
};
