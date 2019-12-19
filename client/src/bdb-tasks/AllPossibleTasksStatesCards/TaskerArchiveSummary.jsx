import React from 'react';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';
import {
  SummaryStartDateAndTime,
  JobCardTitle,
  CountDownComponent,
  TaskImagesCarousel,
  ArchiveTask,
  UserGivenTitle,
} from '../../containers/commonComponents';

import TASKS_DEFINITIONS from '../tasksDefinitions';
import RequestBaseContainer from './RequestBaseContainer';

export default class TaskerArchiveSummary extends RequestBaseContainer {
  render() {
    const { bid, job } = this.props;

    const { taskImages = [], jobTitle, completionDate } = job;

    const { TITLE, ICON, IMG } = TASKS_DEFINITIONS[`${job.templateId}`];

    return (
      <div className="card has-text-centered cardWithButton">
        <div className="card-content">
          <div className="content">
            <JobCardTitle icon={ICON} title={TITLE} img={IMG} />
            <UserGivenTitle userGivenTitle={jobTitle} />

            <TaskImagesCarousel taskImages={taskImages} />

            <SummaryStartDateAndTime
              date={completionDate}
              renderHelpComponent={() => <CountDownComponent startingDate={completionDate} />}
            />
            <ArchiveTask />
          </div>
        </div>

        <div className="centeredButtonInCard ">
          <a
            onClick={() => {
              switchRoute(
                ROUTES.CLIENT.BIDDER.dynamicReviewMyAwardedBidAndTheRequestDetails(bid._id),
              );
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
