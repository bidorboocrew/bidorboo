import React from 'react';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';
import {
  SummaryStartDateAndTime,
  RequestCardTitle,
  TaskIsFulfilled,
  CountDownComponent,
  TaskImagesCarousel,
  ArchiveTask,
  UserGivenTitle,
} from '../../containers/commonComponents';

import TASKS_DEFINITIONS from '../tasksDefinitions';
import RequestBaseContainer from './RequestBaseContainer';

export default class RequesterDoneSummary extends RequestBaseContainer {
  render() {
    const { request } = this.props;

    const {
      _id: requestId,
      startingDateAndTime,
      _reviewRef = {
        revealToBoth: false,
        requiresRequesterReview: true,
        requiresTaskerReview: true,
      },
      taskImages = [],
      requestTitle,
    } = request;

    const { TITLE, ICON, IMG } = TASKS_DEFINITIONS[`${request.templateId}`];
    const { requiresRequesterReview } = _reviewRef;

    return (
      <div className="card has-text-centered cardWithButton">
        <div className="card-content">
          <div className="content">
            <RequestCardTitle icon={ICON} title={TITLE} img={IMG} />
            <UserGivenTitle userGivenTitle={requestTitle} />

            <TaskImagesCarousel taskImages={taskImages} />

            <SummaryStartDateAndTime
              date={startingDateAndTime}
              renderHelpComponent={() => <CountDownComponent startingDate={startingDateAndTime} />}
            />
            {!requiresRequesterReview && <ArchiveTask />}

            {requiresRequesterReview && <TaskIsFulfilled />}
          </div>
        </div>

        <div className="centeredButtonInCard ">
          {!requiresRequesterReview && (
            <a
              onClick={() => {
                switchRoute(ROUTES.CLIENT.REQUESTER.dynamicSelectedAwardedRequestPage(requestId));
              }}
              className="button is-dark"
            >
              VIEW DETAILS
            </a>
          )}
          {requiresRequesterReview && (
            <a
              onClick={() => {
                switchRoute(ROUTES.CLIENT.REQUESTER.dynamicSelectedAwardedRequestPage(requestId));
              }}
              className="button is-primary"
            >
              REVIEW TASKER
            </a>
          )}
        </div>
      </div>
    );
  }
}
