import React from 'react';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';
import {
  CountDownComponent,
  SummaryStartDateAndTime,
  BSawaitingOnRequester,
  JobCardTitle,
  TaskImagesCarousel,
  UserGivenTitle,
  TaskerWillEarn,
} from '../../containers/commonComponents';

import TASKS_DEFINITIONS from '../tasksDefinitions';

export default class TaskerMyOpenBidSummary extends React.Component {
  render() {
    const { bid, job } = this.props;

    const { startingDateAndTime, taskImages = [], jobTitle } = job;

    const { taskerPayout, isNewBid } = bid;

    const taskerTotalPayoutAmount = taskerPayout.value;

    const { TITLE, ICON, IMG } = TASKS_DEFINITIONS[`${job.templateId}`];

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

            <BSawaitingOnRequester />
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
          <span>CHANGE BID</span>
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
          <span>VIEW DETAILS</span>
        </a>
      </div>
    );
  }
};
