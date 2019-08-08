import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { proposerConfirmsJobCompletion } from '../../app-state/actions/jobActions';
import { showLoginDialog } from '../../app-state/actions/uiActions';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';
import {
  CountDownComponent,
  JobCardTitle,
  CancelledBy,
  SummaryStartDateAndTime,
} from '../../containers/commonComponents';
import { cancelAwardedBid } from '../../app-state/actions/bidsActions';

import TASKS_DEFINITIONS from '../tasksDefinitions';

class TaskerAwardedBidCanceledByTaskerSummary extends React.Component {
  render() {
    const { bid, job } = this.props;
    if (!bid || !job) {
      return <div>TaskerAwardedBidCanceledByTaskerSummary is missing properties</div>;
    }

    const { startingDateAndTime } = job;
    if (!startingDateAndTime) {
      return <div>TaskerAwardedBidCanceledByTaskerSummary is missing properties</div>;
    }
    const { TITLE, ICON } = TASKS_DEFINITIONS[`${job.templateId}`];
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

    return (
      <React.Fragment>
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
              <CancelledBy name="You" />
            </div>
          </div>
          <div className="centeredButtonInCard">
            <a
              style={{ position: 'relative' }}
              onClick={() => {
                switchRoute(
                  ROUTES.CLIENT.BIDDER.dynamicReviewMyAwardedBidAndTheRequestDetails(bid._id),
                );
              }}
              className="button is-danger "
            >
              Implications
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TaskerAwardedBidCanceledByTaskerSummary);

const renderFooter = ({ bid }) => {
  return <div style={{ padding: '0 0.5rem 0.5rem 0.5rem' }} />;
};
