import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';
import {
  CountDownComponent,
  RequestCardTitle,
  SummaryStartDateAndTime,
  CancelledBy,
  TaskImagesCarousel,
  UserGivenTitle,
  TaskerWillEarn,
} from '../../containers/commonComponents';
import TASKS_DEFINITIONS from '../tasksDefinitions';
import { updateRequestState } from '../../app-state/actions/requestActions';
import { REQUEST_STATES } from '../index';

class TaskerAwardedBidCanceledByRequesterDetails extends React.Component {
  componentDidMount() {
    const { updateRequestState, request } = this.props;
    updateRequestState(request._id, REQUEST_STATES.AWARDED_REQUEST_CANCELED_BY_REQUESTER_SEEN);
  }
  render() {
    const { bid, request } = this.props;

    const { startingDateAndTime, taskImages = [], requestTitle } = request;

    const { TITLE, ICON, IMG } = TASKS_DEFINITIONS[`${request.templateId}`];

    const { taskerPartialPayout } = bid;
    const { value: taskerPartialPayoutAmount } = taskerPartialPayout;

    return (
      <div
        style={{ border: '1px solid #ee2a36' }}
        className={`card has-text-centered cardWithButton nofixedwidth`}
      >
        <div className="card-content">
          <div className="content">
            <RequestCardTitle icon={ICON} title={TITLE} img={IMG} />
            <UserGivenTitle userGivenTitle={requestTitle} />

            <TaskImagesCarousel taskImages={taskImages} isLarge />
            <SummaryStartDateAndTime
              date={startingDateAndTime}
              renderHelpComponent={() => <CountDownComponent startingDate={startingDateAndTime} />}
            />
            <TaskerWillEarn earningAmount={taskerPartialPayoutAmount}></TaskerWillEarn>

            <CancelledBy name="Requester" />
            <div className="group has-text-left">
              <label className="label has-text-danger">What you need to know:</label>
              <ul>
                <li>At BidOrBoo we takes cancellations seriously</li>
                <li>
                  You will <strong>get paid ${taskerPartialPayoutAmount}</strong> for your
                  commitment with us.
                </li>
                <li>
                  Please, <strong>DO NOT</strong>contact the requester or show up to do the task.
                </li>
                <li>
                  The Requester global rating will be negatively affected because they cancelled.
                </li>
                <li>If The requester cancels often they will be banned from BidOrBoo</li>
              </ul>
            </div>
          </div>
        </div>

        <a
          className="button firstButtonInCard"
          onClick={() => switchRoute(ROUTES.CLIENT.TASKER.mybids)}
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

const mapDispatchToProps = (dispatch) => {
  return {
    updateRequestState: bindActionCreators(updateRequestState, dispatch),
  };
};
export default connect(null, mapDispatchToProps)(TaskerAwardedBidCanceledByRequesterDetails);
