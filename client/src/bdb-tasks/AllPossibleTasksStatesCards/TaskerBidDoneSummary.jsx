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

export default class TaskerBidDoneSummary extends React.Component {
  render() {
    const { bid, request } = this.props;

    const { startingDateAndTime, taskImages = [], requestTitle, state, _reviewRef } = request;

    const { TITLE, ICON, IMG } = TASKS_DEFINITIONS[`${request.templateId}`];

    const { taskerPayout, isAwardedToMe } = bid;
    const { value: taskerTotalPayoutAmount } = taskerPayout;
    const requiresTaskerReview = _reviewRef.requiresTaskerReview;

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
                <TaskIsFulfilled
                  renderHelp={() => {
                    if (requiresTaskerReview) {
                      return <div className="help">Waiting on your review</div>;
                    }
                    if (!requiresTaskerReview) {
                      return <div className="help">Waiting on Requester's review</div>;
                    }
                  }}
                />
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
              <span>View Details</span>
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
