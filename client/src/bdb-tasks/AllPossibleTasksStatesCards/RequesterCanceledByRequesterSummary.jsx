import React from 'react';
import {
  CountDownComponent,
  SummaryStartDateAndTime,
  JobCardTitle,
  CancelledBy,
  TaskImagesCarousel,
  UserGivenTitle,
} from '../../containers/commonComponents';
import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';

import TASKS_DEFINITIONS from '../tasksDefinitions';

export default class RequesterCanceledByRequesterSummary extends React.Component {
  render() {
    const { job } = this.props;

    const { startingDateAndTime, taskImages = [], jobTitle } = job;

    const { TITLE, ICON, IMG } = TASKS_DEFINITIONS[`${job.templateId}`];

    return (
      <div
        style={{ border: '1px solid #ee2a36' }}
        className="card has-text-centered cardWithButton"
      >
        <div className="card-content">
          <div className="content">
            <JobCardTitle icon={ICON} title={TITLE} img={IMG} />
            <UserGivenTitle userGivenTitle={jobTitle} />

            <TaskImagesCarousel taskImages={taskImages} />
            <SummaryStartDateAndTime
              date={startingDateAndTime}
              renderHelpComponent={() => (
                <CountDownComponent startingDate={startingDateAndTime} />
              )}
            />

            <CancelledBy name={'You'} />
          </div>
        </div>

        <div className="centeredButtonInCard">
          <a
            onClick={() => {
              switchRoute(ROUTES.CLIENT.REQUESTER.dynamicSelectedAwardedJobPage(job._id));
            }}
            className="button is-danger"
          >
            VIEW DETAILS
          </a>
        </div>
      </div>
    );
  }
}
