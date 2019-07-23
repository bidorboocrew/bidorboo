import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { proposerConfirmsJobCompletion } from '../../app-state/actions/jobActions';
import { showLoginDialog } from '../../app-state/actions/uiActions';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';
import { CountDownComponent, StartDateAndTime } from '../../containers/commonComponents';
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
    // xxxxxxxxxxxxxxxxxxxxxxxxxxxxx get bid amount from processed payment
    const { value: bidValue, currency: bidCurrency } = bidAmount;
    if (!bidValue || !bidCurrency) {
      return <div>TaskerAwardedBidCanceledByTaskerDetails is missing properties</div>;
    }

    return (
      <div className={`card readOnlyView`}>
        <div className="card-content">
          <div className="content">
            <div style={{ display: 'flex' }}>
              <div style={{ flexGrow: 1 }} className="is-size-4 has-text-weight-bold">
                <span className="icon">
                  <i className={ICON} />
                </span>
                <span style={{ marginLeft: 4 }}>{TITLE}</span>
              </div>
            </div>
            <div
              style={{
                backgroundColor: ' whitesmoke',
                border: 'none',
                display: 'block',
                height: 2,
                margin: '0.5rem 0',
              }}
              className="navbar-divider"
            />
            <div className="group saidTest">
              <label className="label">Request Status</label>
              <div className="control has-text-danger">{displayStatus}</div>
              <div className="help">* You cancelled this after commitment.</div>
            </div>

            <div className="group saidTest">
              <label className="label">Missed Payout</label>
              <div>{`${bidValue - Math.ceil(bidValue * 0.04)}$ (${bidCurrency})`}</div>
              <div className="help">* Was fully refunded to the Requester since you cancelled</div>
            </div>

            <StartDateAndTime
              date={startingDateAndTime}
              renderHelpComponent={() => (
                <CountDownComponent startingDate={startingDateAndTime} isJobStart={false} />
              )}
            />
            <div className="group saidTest">
              <label className="label has-text-danger">What you need to know:</label>

              <div className="control">* Your global rating will be impacted</div>
              <div className="control">* This cancellation will show up on your profile</div>
              <div className="control">
                * If many cancellations happen in a row you will be ban from BidOrBoo
              </div>
            </div>

            <div style={{ padding: '0 0.5rem 0.5rem 0.5rem' }}>
              <a className="button" onClick={() => switchRoute(ROUTES.CLIENT.BIDDER.mybids)}>
                <span className="icon">
                  <i className="far fa-arrow-alt-circle-left" />
                </span>
                <span>I understand</span>
              </a>
            </div>
          </div>
        </div>
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
