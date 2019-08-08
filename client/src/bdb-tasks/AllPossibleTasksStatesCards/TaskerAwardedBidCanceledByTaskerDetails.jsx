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
} from '../../containers/commonComponents';
import { cancelAwardedBid } from '../../app-state/actions/bidsActions';

import TASKS_DEFINITIONS from '../tasksDefinitions';

class TaskerAwardedBidCanceledByTaskerDetails extends React.Component {
  render() {
    const { bid, job } = this.props;
    if (!bid || !job) {
      return <div>TaskerAwardedBidCanceledByTaskerDetails is missing properties</div>;
    }

    const { startingDateAndTime } = job;
    if (!startingDateAndTime) {
      return <div>TaskerAwardedBidCanceledByTaskerDetails is missing properties</div>;
    }
    const { TITLE, ICON } = TASKS_DEFINITIONS[`${job.templateId}`];
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

    return (
      <div className={`card has-text-centered cardWithButton nofixedwidth`}>
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
            <div className="group has-text-left">
              <label className="label has-text-danger">What you need to know:</label>
              <ul>
                <li>
                  <strong>Requester was notified about this</strong> and will not be expecting you
                  to show up.
                </li>
                <li>
                  You will <strong>Not</strong> recieve any payout for this task.
                </li>
                <li>
                  Your global rating will be <strong>Negatively</strong> affected because you
                  cancelled.
                </li>

                <li>Your global rating will be negatively impacted</li>
                <li>
                  If many cancellations happen in a row you will be <strong>banned</strong> from
                  BidOrBoo
                </li>
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
