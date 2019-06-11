import React from 'react';
import ReactDOM from 'react-dom';

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
    const { TITLE } = TASKS_DEFINITIONS[`${job.fromTemplateId}`];
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
        <div className={`card limitWidthOfCard readOnlyView`}>
          <div className="card-content">
            <div className="content">
              <div style={{ display: 'flex' }}>
                <div style={{ flexGrow: 1 }} className="is-size-4 has-text-weight-bold">
                  <span className="icon">
                    <i className="fas fa-home" />
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
              <div className="field">
                <label className="label">Request Status</label>
                <div className="control has-text-danger">{displayStatus}</div>
                <div className="help">* You cancelled this after commitment.</div>
              </div>

              <div className="field">
                <label className="label">Missed Payout</label>
                <div>{`${bidValue - Math.ceil(bidValue * 0.04)}$ (${bidCurrency})`}</div>
                <div className="help">
                  * Was fully refunded to the Requester since you cancelled
                </div>
              </div>
              <StartDateAndTime
                date={startingDateAndTime}
                renderHelpComponent={() => (
                  <CountDownComponent startingDate={startingDateAndTime} isJobStart={false} />
                )}
              />
            </div>
          </div>
          {renderFooter({ bid })}
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
  return (
    <React.Fragment>
      <div style={{ padding: '0.5rem' }}>
        <hr className="divider isTight" />
      </div>
      <div style={{ padding: '0 0.5rem 0.5rem 0.5rem' }}>
        <a
          style={{ position: 'relative' }}
          onClick={() => {
            switchRoute(
              ROUTES.CLIENT.BIDDER.dynamicReviewMyAwardedBidAndTheRequestDetails(bid._id),
            );
          }}
          className="button is-outlined is-danger"
        >
          View Implications
        </a>
      </div>
    </React.Fragment>
  );
};
