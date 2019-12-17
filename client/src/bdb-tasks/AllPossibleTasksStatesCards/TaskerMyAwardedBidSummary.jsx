import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateJobState } from '../../app-state/actions/jobActions';

import { REQUEST_STATES } from '../index';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';
import {
  CountDownComponent,
  SummaryStartDateAndTime,
  BSTaskerAwarded,
  JobCardTitle,
  TaskImagesCarousel,
  UserGivenTitle,
  TaskerWillEarn,
  BSWaitingOnRequesterToConfirm,
} from '../../containers/commonComponents';

import TASKS_DEFINITIONS from '../tasksDefinitions';

class TaskerMyAwardedBidSummary extends React.Component {
  render() {
    const { bid, job, notificationFeed, updateJobState } = this.props;

    const { startingDateAndTime, bidderConfirmedCompletion, taskImages = [], jobTitle } = job;

    const { TITLE, ICON, IMG } = TASKS_DEFINITIONS[`${job.templateId}`];
    const { bidderPayout } = bid;
    const { value: taskerTotalPayoutAmount, currency: bidCurrency } = bidderPayout;

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
                  <CountDownComponent startingDate={startingDateAndTime} />
                )}
              />
              <TaskerWillEarn earningAmount={taskerTotalPayoutAmount}></TaskerWillEarn>

              {bidderConfirmedCompletion && <BSWaitingOnRequesterToConfirm />}

              {!bidderConfirmedCompletion && <BSTaskerAwarded />}
            </div>
          </div>
          {renderFooter({ job, bid, notificationFeed, updateJobState, bidderConfirmedCompletion })}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ uiReducer }) => {
  return {
    notificationFeed: uiReducer.notificationFeed,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateJobState: bindActionCreators(updateJobState, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskerMyAwardedBidSummary);

const renderFooter = ({
  job,
  bid,
  notificationFeed,
  updateJobState,
  bidderConfirmedCompletion,
}) => {
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
            newUnseenState && updateJobState(job._id, REQUEST_STATES.AWARDED_SEEN);

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
          {`${bidderConfirmedCompletion ? 'REVIEW REQUESTER' : 'VIEW DETAILS'} `}
        </a>
      </div>
    </React.Fragment>
  );
};
