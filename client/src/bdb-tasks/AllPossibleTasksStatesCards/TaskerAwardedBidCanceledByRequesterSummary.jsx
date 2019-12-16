import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateJobState } from '../../app-state/actions/jobActions';

import { REQUEST_STATES } from '../index';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';
import {
  CountDownComponent,
  JobCardTitle,
  CancelledBy,
  SummaryStartDateAndTime,
  TaskImagesCarousel,
  UserGivenTitle,
  TaskerWillEarn,
} from '../../containers/commonComponents';

import TASKS_DEFINITIONS from '../tasksDefinitions';

class TaskerAwardedBidCanceledByTaskerSummary extends React.Component {
  render() {
    const { bid, job, notificationFeed } = this.props;

    const { startingDateAndTime, taskImages = [], jobTitle } = job;

    const { TITLE, ICON, IMG } = TASKS_DEFINITIONS[`${job.templateId}`];

    const { bidderPartialPayout } = bid;
    const { value: bidderPartialPayoutAmount } = bidderPartialPayout;

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
        <div
          style={{ border: '1px solid #ee2a36' }}
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
              <TaskerWillEarn earningAmount={bidderPartialPayoutAmount}></TaskerWillEarn>

              <CancelledBy name="Requester" />
            </div>
          </div>
          <div className="centeredButtonInCard">
            <a
              style={{ position: 'relative' }}
              onClick={(e) => {
                e.preventDefault();
                newUnseenState &&
                  updateJobState(job._id, REQUEST_STATES.AWARDED_JOB_CANCELED_BY_REQUESTER_SEEN);

                switchRoute(
                  ROUTES.CLIENT.BIDDER.dynamicReviewMyAwardedBidAndTheRequestDetails(bid._id),
                );
              }}
              className="button is-danger"
            >
              {newUnseenState && (
                <div
                  style={{ position: 'absolute', top: -5, right: 0, fontSize: 10 }}
                  className="has-text-danger"
                >
                  <i className="fas fa-circle" />
                </div>
              )}
              VIEW DETAILS
            </a>
          </div>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TaskerAwardedBidCanceledByTaskerSummary);
