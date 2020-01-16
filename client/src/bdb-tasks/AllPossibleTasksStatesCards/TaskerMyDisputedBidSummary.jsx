import React from 'react';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';
import {
  UserGivenTitle,
  RequestCardTitle,
  TaskImagesCarousel,
  SummaryStartDateAndTime,
  DisputedBy,
  TaskerWillEarn,
  BidAmount,
} from '../../containers/commonComponents';

import TASKS_DEFINITIONS from '../tasksDefinitions';

export default class TaskerMyDisputedBidSummary extends React.Component {
  render() {
    const { bid, request } = this.props;

    const { startingDateAndTime, taskImages = [], requestTitle, dispute } = request;

    const { TITLE, ICON, IMG } = TASKS_DEFINITIONS[`${request.templateId}`];

    const { taskerPayout, bidAmount } = bid;
    const { value: bidValue } = bidAmount;
    const { value: taskerTotalPayoutAmount } = taskerPayout;

    let whoDisputed = '';
    const { requesterDispute } = dispute;
    if (requesterDispute && requesterDispute.reason) {
      whoDisputed = 'Requester';
    } else {
      whoDisputed = 'You';
    }

    return (
      <div className={`card has-text-centered disputeOnlyView cardWithButton`}>
        <div className="card-content">
          <div className="content">
            <RequestCardTitle icon={ICON} title={TITLE} img={IMG} />
            <UserGivenTitle userGivenTitle={requestTitle} />

            <TaskImagesCarousel taskImages={taskImages} />

            <SummaryStartDateAndTime date={startingDateAndTime} />

            {/* <TaskerWillEarn earningAmount={taskerTotalPayoutAmount}></TaskerWillEarn> */}

            <DisputedBy name={whoDisputed} />
            <BidAmount bidAmount={bidValue} />
          </div>
        </div>

        <div className="centeredButtonInCard">
          <a
            style={{ position: 'relative' }}
            onClick={() => {
              switchRoute(
                ROUTES.CLIENT.TASKER.dynamicReviewMyAwardedBidAndTheRequestDetails(bid._id),
              );
            }}
            className="button is-fullwidth is-danger"
          >
            View Details
          </a>
        </div>
      </div>
    );
  }
}
