import React from 'react';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';
import {
  SummaryStartDateAndTime,
  RequestCardTitle,
  TaskIsFulfilled,
  CountDownComponent,
  TaskImagesCarousel,
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
      _reviewRef,
      taskImages = [],
      requestTitle,
      completionDate,
    } = request;

    const { TITLE, ICON, IMG } = TASKS_DEFINITIONS[`${request.templateId}`];
    const requiresRequesterReview = _reviewRef.requiresRequesterReview;

    return (
      <div className="card has-text-centered cardWithButton">
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

            <TaskIsFulfilled
              renderHelp={() => {
                if (requiresRequesterReview) {
                  return <div className="help">Waiting on your review</div>;
                }
                if (!requiresRequesterReview) {
                  return <div className="help">Waiting on Tasker's review</div>;
                }
              }}
            />
          </div>
        </div>

        <div className="centeredButtonInCard ">
          <a
            onClick={() => {
              switchRoute(ROUTES.CLIENT.REQUESTER.dynamicSelectedAwardedRequestPage(requestId));
            }}
            className="button is-primary"
          >
            {requiresRequesterReview ? 'Review Tasker' : 'View Details'}
          </a>
        </div>
      </div>
    );
  }
}
