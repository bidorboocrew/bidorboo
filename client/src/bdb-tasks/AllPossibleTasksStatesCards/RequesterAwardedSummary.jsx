import React from 'react';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';
import {
  CountDownComponent,
  RequestCardTitle,
  SummaryStartDateAndTime,
  AssignedTasker,
  TaskImagesCarousel,
  UserGivenTitle,
} from '../../containers/commonComponents';

import TASKS_DEFINITIONS from '../tasksDefinitions';
import RequestBaseContainer from './RequestBaseContainer';

export default class RequesterAwardedSummary extends RequestBaseContainer {
  render() {
    const { request } = this.props;
    const {
      _id: requestId,
      startingDateAndTime,
      taskerConfirmedCompletion,
      requestTitle,
      taskImages = [],
    } = request;

    const { TITLE, ICON, IMG } = TASKS_DEFINITIONS[`${request.templateId}`];

    return (
      <React.Fragment>
        <div
          style={{ border: '1px solid #26ca70' }}
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
                renderHelpComponent={() => (
                  <CountDownComponent startingDate={startingDateAndTime} />
                )}
              />
              <AssignedTasker />
            </div>
          </div>

          <div className="centeredButtonInCard">
            <a
              onClick={() => {
                switchRoute(ROUTES.CLIENT.REQUESTER.dynamicSelectedAwardedRequestPage(requestId));
              }}
              className={`button is-success`}
            >
              {taskerConfirmedCompletion ? 'CONFIRM COMPLETION' : 'View Details'}
            </a>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
