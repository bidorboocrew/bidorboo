import React from 'react';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';
import {
  CountDownComponent,
  JobCardTitle,
  SummaryStartDateAndTime,
  CancelledBy,
  TaskImagesCarousel,
  UserGivenTitle,
} from '../../containers/commonComponents';

import TASKS_DEFINITIONS from '../tasksDefinitions';

export default class TaskerAwardedBidCanceledByTaskerDetails extends React.Component {
  render() {
    const { bid, job } = this.props;

    const { startingDateAndTime, taskImages = [], jobTitle } = job;
    const { TITLE, ICON, IMG } = TASKS_DEFINITIONS[`${job.templateId}`];

    return (
      <div
        style={{ border: '1px solid #ee2a36' }}
        className={`card has-text-centered cardWithButton nofixedwidth`}
      >
        <div className="card-content">
          <div className="content">
            <JobCardTitle icon={ICON} title={TITLE} img={IMG} />
            <UserGivenTitle userGivenTitle={jobTitle} />

            <TaskImagesCarousel taskImages={taskImages} isLarge />
            <SummaryStartDateAndTime
              date={startingDateAndTime}
              renderHelpComponent={() => <CountDownComponent startingDate={startingDateAndTime} />}
            />
            <CancelledBy name="You" />
            <div className="group has-text-left">
              <label className="label has-text-danger">What you need to know:</label>
              <ul>
                <li>
                  <strong>Requester was notified and will NOT be expecting you to show up.</strong>
                </li>
                <li>You will not receive any payout for this task.</li>
                <li>Your global rating will be negatively impacted</li>
                <li>Cancelling often will put a ban on your account</li>
              </ul>
            </div>
          </div>
        </div>

        <a
          className="button firstButtonInCard"
          onClick={() => switchRoute(ROUTES.CLIENT.BIDDER.mybids)}
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
