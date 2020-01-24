import React from 'react';
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

export default class RequesterCanceledByRequesterSummary extends React.Component {
  render() {
    const { request } = this.props;

    const { startingDateAndTime, taskImages = [], requestTitle } = request;

    const { TITLE, ICON, IMG } = TASKS_DEFINITIONS[`${request.templateId}`];

    return (
      <div
        style={{ border: '1px solid #ee2a36' }}
        className="card has-text-centered cardWithButton"
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
              renderHelpComponent={() => <CountDownComponent startingDate={startingDateAndTime} />}
            />

            <CancelledBy name={'You'} />
          </div>
        </div>

        <div className="centeredButtonInCard">
          <a
            onClick={() => {
              switchRoute(ROUTES.CLIENT.REQUESTER.dynamicSelectedAwardedRequestPage(request._id));
            }}
            className="button is-danger"
          >
            View Details
          </a>
        </div>
      </div>
    );
  }
}
