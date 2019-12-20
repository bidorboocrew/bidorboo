import React from 'react';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';
import {
  CountDownComponent,
  TaskIsFulfilled,
  RequestCardTitle,
  SummaryStartDateAndTime,
  BSAwardedToSomeoneElse,
  TaskImagesCarousel,
  UserGivenTitle,
  TaskerWillEarn,
} from '../../containers/commonComponents';
import { REQUEST_STATES } from '../index';

import TASKS_DEFINITIONS from '../tasksDefinitions';

export default class TaskerMyAwardedDoneBidSummary extends React.Component {
  render() {
    const { bid, request } = this.props;

    const { startingDateAndTime, taskImages = [], requestTitle, state } = request;

    const { TITLE, ICON, IMG } = TASKS_DEFINITIONS[`${request.templateId}`];

    const { taskerPayout, isAwardedToMe } = bid;
    const { value: taskerTotalPayoutAmount } = taskerPayout;

    return (
      <div className={`card has-text-centered cardWithButton`}>
        <div className="card-content">
          <div className="content">
            <RequestCardTitle icon={ICON} title={TITLE} img={IMG} />
            <UserGivenTitle userGivenTitle={requestTitle} />

            <TaskImagesCarousel taskImages={taskImages} />
            <SummaryStartDateAndTime
              date={startingDateAndTime}
              renderHelpComponent={() => <CountDownComponent startingDate={startingDateAndTime} />}
            />
            {isAwardedToMe && (
              <>
                <TaskerWillEarn earningAmount={taskerTotalPayoutAmount} />
                <TaskIsFulfilled />
              </>
            )}
            {!isAwardedToMe && <BSAwardedToSomeoneElse />}
          </div>
        </div>
        <div className="centeredButtonInCard">
          {isAwardedToMe && (
            <a
              onClick={() => {
                switchRoute(
                  ROUTES.CLIENT.TASKER.dynamicReviewMyAwardedBidAndTheRequestDetails(bid._id),
                );
              }}
              className={`button is-primary`}
            >
              <span>Review Details</span>
              {REQUEST_STATES.AWARDED === state && (
                <div
                  style={{ position: 'absolute', top: -5, right: 0, fontSize: 10 }}
                  className="has-text-danger"
                >
                  <i className="fas fa-circle" />
                </div>
              )}
            </a>
          )}
        </div>
      </div>
    );
  }
}
