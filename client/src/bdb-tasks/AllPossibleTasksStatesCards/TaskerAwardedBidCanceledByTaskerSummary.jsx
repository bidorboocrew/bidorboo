import React from 'react';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';
import {
  CountDownComponent,
  RequestCardTitle,
  CancelledBy,
  SummaryStartDateAndTime,
  TaskImagesCarousel,
  UserGivenTitle,
  BidAmount,
} from '../../containers/commonComponents';

import TASKS_DEFINITIONS from '../tasksDefinitions';

export default class TaskerAwardedBidCanceledByTaskerSummary extends React.Component {
  render() {
    const { bid, request } = this.props;
    const { bidAmount } = bid;
    const { value: bidValue } = bidAmount;
    const { startingDateAndTime, taskImages = [], requestTitle } = request;
    const { TITLE, ICON, IMG } = TASKS_DEFINITIONS[`${request.templateId}`];

    return (
      <React.Fragment>
        <div
          style={{ border: '1px solid #ee2a36' }}
          className={`card has-text-centered cardWithButton`}
        >
          <div className="card-content">
            <div className="content">
              <RequestCardTitle
                icon={ICON}
                title={TITLE}
                img={taskImages && taskImages.length > 0 ? taskImages[0].url : IMG}
              />
              <UserGivenTitle userGivenTitle={requestTitle} />

              <SummaryStartDateAndTime
                date={startingDateAndTime}
                renderHelpComponent={() => (
                  <CountDownComponent startingDate={startingDateAndTime} />
                )}
              />

              <CancelledBy name="You" />
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
              className="button is-danger "
            >
              View Details
            </a>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
