import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateRequestState } from '../../app-state/actions/requestActions';

import {
  CountDownComponent,
  SummaryStartDateAndTime,
  RequestCardTitle,
  CancelledBy,
  TaskImagesCarousel,
  UserGivenTitle,
} from '../../containers/commonComponents';
import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';

import TASKS_DEFINITIONS from '../tasksDefinitions';

class RequesterCanceledByTaskerSummary extends React.Component {
  render() {
    const { request, updateRequestState, notificationFeed } = this.props;

    const { startingDateAndTime, taskImages = [], requestTitle } = request;

    const { TITLE, ICON, IMG } = TASKS_DEFINITIONS[`${request.templateId}`];

    let newUnseenState = false;
    if (notificationFeed && notificationFeed.requestIdsWithNewBids) {
      for (let i = 0; i < notificationFeed.requestIdsWithNewBids.length; i++) {
        if (notificationFeed.requestIdsWithNewBids[i]._id === request._id) {
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
            <RequestCardTitle icon={ICON} title={TITLE} img={IMG} />
            <UserGivenTitle userGivenTitle={requestTitle} />

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
                newUnseenState && updateRequestState(request._id, 'AWARDED_REQUEST_CANCELED_BY_TASKER_SEEN');

                switchRoute(ROUTES.CLIENT.REQUESTER.dynamicSelectedAwardedRequestPage(request._id));
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
              View Details
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
    updateRequestState: bindActionCreators(updateRequestState, dispatch),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(RequesterCanceledByTaskerSummary);
