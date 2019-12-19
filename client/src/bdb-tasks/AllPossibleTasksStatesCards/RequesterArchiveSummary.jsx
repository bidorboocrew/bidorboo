import React from 'react';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';
import {
  SummaryStartDateAndTime,
  RequestCardTitle,
  CountDownComponent,
  TaskImagesCarousel,
  ArchiveTask,
  UserGivenTitle,
} from '../../containers/commonComponents';

import TASKS_DEFINITIONS from '../tasksDefinitions';
import RequestBaseContainer from './RequestBaseContainer';

export default class RequesterArchiveSummary extends RequestBaseContainer {
  render() {
    const { request } = this.props;

    const { _id: requestId, startingDateAndTime, taskImages = [], requestTitle, completionDate } = request;

    const { TITLE, ICON, IMG } = TASKS_DEFINITIONS[`${request.templateId}`];

    return (
      <div className="card has-text-centered cardWithButton">
        <div className="card-content">
          <div className="content">
            <RequestCardTitle icon={ICON} title={TITLE} img={IMG} />
            <UserGivenTitle userGivenTitle={requestTitle} />

            <TaskImagesCarousel taskImages={taskImages} />

            <SummaryStartDateAndTime
              date={completionDate}
              renderHelpComponent={() => <CountDownComponent startingDate={startingDateAndTime} />}
            />
            <ArchiveTask />
          </div>
        </div>

        <div className="centeredButtonInCard ">
          <a
            onClick={() => {
              switchRoute(ROUTES.CLIENT.REQUESTER.dynamicSelectedAwardedRequestPage(requestId));
            }}
            className="button is-dark"
          >
            Review Details
          </a>
        </div>
      </div>
    );
  }
}
