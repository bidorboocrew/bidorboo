import React from 'react';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';
import {
  CountDownComponent,
  SummaryStartDateAndTime,
  BSawaitingOnRequester,
  RequestCardTitle,
  TaskImagesCarousel,
  UserGivenTitle,
  TaskerWillEarn,
  BidAmount,
} from '../../containers/commonComponents';

import TASKS_DEFINITIONS from '../tasksDefinitions';

export default class TaskerMyOpenBidSummary extends React.Component {
  render() {
    const { bid, request } = this.props;

    const { startingDateAndTime, taskImages = [], requestTitle } = request;

    const { taskerPayout, isNewBid, bidAmount } = bid;

    const { value: bidValue } = bidAmount;

    const taskerTotalPayoutAmount = taskerPayout.value;

    const { TITLE, ICON, IMG } = TASKS_DEFINITIONS[`${request.templateId}`];

    return (
      <div className={`card has-text-centered cardWithButton`}>
        <div className="card-content">
          <div className="content">
            <RequestCardTitle icon={ICON} title={TITLE} img={IMG} />
            <UserGivenTitle userGivenTitle={requestTitle} />

            <SummaryStartDateAndTime
              date={startingDateAndTime}
              renderHelpComponent={() => <CountDownComponent startingDate={startingDateAndTime} />}
            />

            {/* <TaskerWillEarn earningAmount={taskerTotalPayoutAmount}></TaskerWillEarn> */}

            <BSawaitingOnRequester />
            <BidAmount bidAmount={bidValue}></BidAmount>
            {/* <TaskImagesCarousel taskImages={taskImages} /> */}
          </div>
        </div>
        {renderFooter({ bid, isNewBid })}
      </div>
    );
  }
}

const renderFooter = ({ bid, isNewBid }) => {
  if (isNewBid) {
    return (
      <div className="centeredButtonInCard">
        <a
          onClick={() => {
            switchRoute(ROUTES.CLIENT.TASKER.dynamicReviewMyOpenBidAndTheRequestDetails(bid._id));
          }}
          className={`button is-fullwidth is-info`}
        >
          <span>Change Bid</span>
        </a>
      </div>
    );
  } else {
    return (
      <div className="centeredButtonInCard">
        <a
          onClick={() => {
            switchRoute(ROUTES.CLIENT.TASKER.dynamicReviewMyOpenBidAndTheRequestDetails(bid._id));
          }}
          className={`button is-fullwidth is-info`}
        >
          <span>View Details</span>
        </a>
      </div>
    );
  }
};
