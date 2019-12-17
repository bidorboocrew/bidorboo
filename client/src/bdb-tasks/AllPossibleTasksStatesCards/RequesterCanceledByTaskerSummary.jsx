import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateJobState } from '../../app-state/actions/jobActions';

import {
  CountDownComponent,
  SummaryStartDateAndTime,
  JobCardTitle,
  CancelledBy,
  TaskImagesCarousel,
  UserGivenTitle,
} from '../../containers/commonComponents';
import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';

import TASKS_DEFINITIONS from '../tasksDefinitions';

class RequesterCanceledByTaskerSummary extends React.Component {
  render() {
    const { job, updateJobState, notificationFeed } = this.props;

    const { startingDateAndTime, taskImages = [], jobTitle } = job;

    const { TITLE, ICON, IMG } = TASKS_DEFINITIONS[`${job.templateId}`];

    let newUnseenState = false;
    if (notificationFeed && notificationFeed.jobIdsWithNewBids) {
      for (let i = 0; i < notificationFeed.jobIdsWithNewBids.length; i++) {
        if (notificationFeed.jobIdsWithNewBids[i]._id === job._id) {
          newUnseenState = true;
          break;
        }
      }
    }

    return (
      <div
        style={{ border: '1px solid #ee2a36' }}
        className="card has-text-centered cardWithButton"
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

            <CancelledBy name={'Tasker'} />
          </div>
        </div>

        <React.Fragment>
          <div className="centeredButtonInCard">
            <a
              style={{ position: 'relative' }}
              onClick={(e) => {
                e.preventDefault();
                newUnseenState && updateJobState(job._id, 'AWARDED_JOB_CANCELED_BY_BIDDER_SEEN');

                switchRoute(ROUTES.CLIENT.PROPOSER.dynamicSelectedAwardedJobPage(job._id));
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
        </React.Fragment>
      </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(RequesterCanceledByTaskerSummary);
