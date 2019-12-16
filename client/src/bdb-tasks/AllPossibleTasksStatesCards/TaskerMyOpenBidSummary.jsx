import React from 'react';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';
import {
  CountDownComponent,
  SummaryStartDateAndTime,
  BSawaitingOnRequester,
  JobCardTitle,
  BSAwardedToSomeoneElse,
  TaskImagesCarousel,
  UserGivenTitle,
  TaskerWillEarn,
} from '../../containers/commonComponents';

import TASKS_DEFINITIONS from '../tasksDefinitions';
import { REQUEST_STATES } from '../index';

export default class TaskerMyOpenBidSummary extends React.Component {
  render() {
    const { bid, job } = this.props;

    const { startingDateAndTime, state, taskImages = [], jobTitle } = job;

    const { bidderPayout, isNewBid } = bid;

    const taskerTotalPayoutAmount = bidderPayout.value;

    const { TITLE, ICON, IMG } = TASKS_DEFINITIONS[`${job.templateId}`];

    const isAwardedToSomeoneElse =
      (state === REQUEST_STATES.AWARDED || state === REQUEST_STATES.AWARDED_SEEN) &&
      bid._id !== job._awardedBidRef;

    return (
      <div className={`card has-text-centered cardWithButton`}>
        <div className="card-content">
          <div className="content">
            <JobCardTitle icon={ICON} title={TITLE} img={IMG} />
            <UserGivenTitle userGivenTitle={jobTitle} />

            <TaskImagesCarousel taskImages={taskImages} />

            <SummaryStartDateAndTime
              date={startingDateAndTime}
              renderHelpComponent={() => <CountDownComponent startingDate={startingDateAndTime} />}
            />
            <TaskerWillEarn earningAmount={taskerTotalPayoutAmount}></TaskerWillEarn>

            {isAwardedToSomeoneElse && <BSAwardedToSomeoneElse />}

            {!isAwardedToSomeoneElse && <BSawaitingOnRequester />}
          </div>
        </div>
        {renderFooter({ bid, isAwardedToSomeoneElse, isNewBid })}
      </div>
    );
  }
}

const renderFooter = ({ bid, isAwardedToSomeoneElse, isNewBid }) => {
  if (isAwardedToSomeoneElse) {
    return null;
  } else if (!isAwardedToSomeoneElse && isNewBid) {
    return (
      <div className="centeredButtonInCard">
        <a
          onClick={() => {
            switchRoute(ROUTES.CLIENT.BIDDER.dynamicReviewMyOpenBidAndTheRequestDetails(bid._id));
          }}
          className={`button is-fullwidth is-info`}
        >
          <span>CHANGE BID</span>
        </a>
      </div>
    );
  } else if (!isAwardedToSomeoneElse && !isNewBid) {
    return (
      <div className="centeredButtonInCard">
        <a
          onClick={() => {
            switchRoute(ROUTES.CLIENT.BIDDER.dynamicReviewMyOpenBidAndTheRequestDetails(bid._id));
          }}
          className={`button is-fullwidth is-info`}
        >
          <span>VIEW DETAILS</span>
        </a>
      </div>
    );
  }
};
