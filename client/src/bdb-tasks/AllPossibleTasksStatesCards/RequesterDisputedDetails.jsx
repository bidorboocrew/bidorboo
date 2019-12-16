import React from 'react';
import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
import {
  CountDownComponent,
  DisputedBy,
  SummaryStartDateAndTime,
  JobCardTitle,
  TaskImagesCarousel,
  UserGivenTitle,
} from '../../containers/commonComponents';

import TASKS_DEFINITIONS from '../tasksDefinitions';

export default class RequesterDisputedDetails extends React.Component {
  render() {
    const { job } = this.props;
    if (!job) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myRequestsPage);
    }

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
      <div className="card has-text-centered disputeOnlyView cardWithButton nofixedwidth">
        <div className="card-content">
          <div className="content">
            <JobCardTitle icon={ICON} title={TITLE} img={IMG} />
            <UserGivenTitle userGivenTitle={jobTitle} />

            <TaskImagesCarousel taskImages={taskImages} isLarge />
            <SummaryStartDateAndTime
              date={startingDateAndTime}
              renderHelpComponent={() => <CountDownComponent startingDate={startingDateAndTime} />}
            />
            <DisputedBy name={whoDisputed} />
            <div className="group has-text-left">
              <label className="label has-text-danger">What you need to know:</label>
              <ul>
                <li>
                  BidOrBoo support crew will assess the dispute asap to ensure your satisfaction
                </li>
                <li>
                  Our customer relation team will be in touch with tasker and requester to gather
                  facts
                </li>
                <li>We will get in touch with you to update you regularly with the status</li>
              </ul>
            </div>
          </div>
        </div>

        <a
          onClick={() => {
            switchRoute(ROUTES.CLIENT.PROPOSER.myRequestsPage);
          }}
          className="button firstButtonInCard"
        >
          <span className="icon">
            <i className="far fa-arrow-alt-circle-left" />
          </span>
          <span>I understand</span>
        </a>
      </div>
    );
  }
}
