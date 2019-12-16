import React from 'react';
import {
  CountDownComponent,
  DisputedBy,
  SummaryStartDateAndTime,
  JobCardTitle,
  TaskImagesCarousel,
  UserGivenTitle,
} from '../../containers/commonComponents';
import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';

import TASKS_DEFINITIONS from '../tasksDefinitions';

export default class RequesterDisputedSummary extends React.Component {
  render() {
    const { job } = this.props;

    const { startingDateAndTime, taskImages = [], jobTitle, dispute } = job;

    const { TITLE, ICON, IMG } = TASKS_DEFINITIONS[`${job.templateId}`];

    let whoDisputed = '';

    const { taskerDispute } = dispute;
    if (taskerDispute && taskerDispute.reason) {
      whoDisputed = 'Tasker';
    } else {
      whoDisputed = 'You';
    }

    return (
      <div className="card has-text-centered disputeOnlyView cardWithButton">
        <div className="card-content">
          <div className="content">
            <JobCardTitle icon={ICON} title={TITLE} img={IMG} />
            <UserGivenTitle userGivenTitle={jobTitle} />

            <TaskImagesCarousel taskImages={taskImages} />

            <SummaryStartDateAndTime
              date={startingDateAndTime}
              renderHelpComponent={() => <CountDownComponent startingDate={startingDateAndTime} />}
            />
            <DisputedBy name={whoDisputed} />
          </div>
        </div>

        <React.Fragment>
          <div className="centeredButtonInCard">
            <a
              onClick={() => {
                switchRoute(ROUTES.CLIENT.PROPOSER.dynamicSelectedAwardedJobPage(job._id));
              }}
              className="button is-fullwidth is-danger"
            >
              VIEW DETAILS
            </a>
          </div>
        </React.Fragment>
      </div>
    );
  }
}
