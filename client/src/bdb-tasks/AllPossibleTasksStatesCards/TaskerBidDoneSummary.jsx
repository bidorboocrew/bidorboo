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
  BidAmount,
} from '../../containers/commonComponents';
import { REQUEST_STATES } from '../index';

import TASKS_DEFINITIONS from '../tasksDefinitions';

export default class TaskerBidDoneSummary extends React.Component {
  render() {
    const { bid, request } = this.props;

    const {
      startingDateAndTime,
      taskImages = [],
      requestTitle,
      state,
      _reviewRef,
      completionDate,
    } = request;

    const { TITLE, ICON, IMG } = TASKS_DEFINITIONS[`${request.templateId}`];

    const { taskerPayout, isAwardedToMe, bidAmount } = bid;
    const { value: bidValue } = bidAmount;

    const { value: taskerTotalPayoutAmount } = taskerPayout;
    const requiresTaskerReview = _reviewRef.requiresTaskerReview;

    return (
      <div className={`card has-text-centered cardWithButton`}>
        <div className="card-content">
          <div className="content">
            <RequestCardTitle
              icon={ICON}
              title={TITLE}
              img={taskImages && taskImages.length > 0 ? taskImages[0].url : IMG}
            />
            <UserGivenTitle userGivenTitle={requestTitle} />

            <SummaryStartDateAndTime
              date={completionDate}
              renderHelpComponent={() => <CountDownComponent startingDate={completionDate} />}
            />

            {isAwardedToMe && (
              <>
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
                {/* <TaskerWillEarn earningAmount={taskerTotalPayoutAmount} /> */}
              </>
            )}
            {!isAwardedToMe && <BSAwardedToSomeoneElse />}
            <BidAmount bidAmount={bidValue} />
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
              {REQUEST_STATES.DONE === state && (
                <div
                  style={{ position: 'absolute', top: -5, right: 0, fontSize: 10 }}
                  className="has-text-danger"
                >
                  <i className="fas fa-circle"></i>
                </div>
              )}
            </a>
          )}
        </div>
      </div>
    );
  }
}
