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
  SummaryStartDateAndTime,
  CancelledBy,
  TaskImagesCarousel,
  UserGivenTitle,
} from '../../containers/commonComponents';
import { cancelAwardedBid } from '../../app-state/actions/bidsActions';
import { getChargeDistributionDetails } from '../../containers/commonUtils';
import TASKS_DEFINITIONS from '../tasksDefinitions';

class TaskerAwardedBidCanceledByTaskerDetails extends React.Component {
  render() {
    const { bid, job } = this.props;
    if (!bid || !job) {
      return <div>TaskerAwardedBidCanceledByTaskerDetails is missing properties</div>;
    }

    const { startingDateAndTime, taskImages = [], jobTitle } = job;
    if (!startingDateAndTime) {
      return <div>TaskerAwardedBidCanceledByTaskerDetails is missing properties</div>;
    }
    const { TITLE, ICON, IMG } = TASKS_DEFINITIONS[`${job.templateId}`];
    if (!TITLE) {
      return <div>TaskerAwardedBidCanceledByTaskerDetails is missing properties</div>;
    }
    const { displayStatus, bidAmount, _id } = bid;
    if (!displayStatus || !bidAmount || !_id) {
      return <div>TaskerAwardedBidCanceledByTaskerDetails is missing properties</div>;
    }

    const { value: bidValue, currency: bidCurrency } = bidAmount;
    if (!bidValue || !bidCurrency) {
      return <div>TaskerAwardedBidCanceledByTaskerDetails is missing properties</div>;
    }

    const { taskerPayoutInCaseOfPartialRefund } = getChargeDistributionDetails(bidValue);

    return (
      <div
        style={{ border: '1px solid #ee2a36' }}
        className={`card has-text-centered cardWithButton nofixedwidth`}
      >
        <div className="card-content">
          <div className="content">
            <JobCardTitle icon={ICON} title={TITLE} img={IMG} />
            <UserGivenTitle userGivenTitle={jobTitle} />

            <TaskImagesCarousel taskImages={taskImages} isLarge />
            <SummaryStartDateAndTime
              date={startingDateAndTime}
              renderHelpComponent={() => (
                <CountDownComponent startingDate={startingDateAndTime} isJobStart={false} />
              )}
            />
            <CancelledBy name="Requester" />
            <div className="group has-text-left">
              <label className="label has-text-danger">What you need to know:</label>
              <ul>
                <li>
                  We Are sorry to see this cancellation as BidOrBoo Crew Takes cancellations
                  seriously
                </li>
                <li>
                  You will <strong>be paid ${taskerPayoutInCaseOfPartialRefund}</strong> for your
                  commitment with us.
                </li>
                <li>
                  <strong>Do NOT</strong> show up or go to do this task as you will not be paid for
                  it.
                </li>
                <li>
                  The Requester global rating will be Negatively affected because they cancelled
                  after awarding you.
                </li>
                <li>If The requester cancels often we will ban them from BidOrBoo</li>
              </ul>
            </div>
          </div>
        </div>

        <a
          className="button firstButtonInCard"
          onClick={() => switchRoute(ROUTES.CLIENT.BIDDER.mybids)}
        >
          <span className="icon">
            <i className="far fa-arrow-alt-circle-left" />
          </span>
          <span>I understand</span>
        </a>
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
)(TaskerAwardedBidCanceledByTaskerDetails);
