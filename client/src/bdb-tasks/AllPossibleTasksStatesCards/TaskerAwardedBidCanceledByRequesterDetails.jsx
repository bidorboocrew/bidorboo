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
  TaskerWillEarn,
} from '../../containers/commonComponents';
import TASKS_DEFINITIONS from '../tasksDefinitions';

export default class TaskerAwardedBidCanceledByTaskerDetails extends React.Component {
  render() {
    const { bid, job } = this.props;

    const { startingDateAndTime, taskImages = [], jobTitle } = job;

    const { TITLE, ICON, IMG } = TASKS_DEFINITIONS[`${job.templateId}`];

    const { bidderPartialPayout } = bid;
    const { value: bidderPartialPayoutAmount } = bidderPartialPayout;

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
            <TaskerWillEarn earningAmount={bidderPartialPayoutAmount}></TaskerWillEarn>

            <CancelledBy name="Requester" />
            <div className="group has-text-left">
              <label className="label has-text-danger">What you need to know:</label>
              <ul>
                <li>At BidOrBoo we takes cancellations seriously</li>
                <li>
                  You will <strong>get paid ${bidderPartialPayoutAmount}</strong> for your
                  commitment with us.
                </li>
                <li>
                  Please, <strong>DO NOT</strong>contact the requester or show up to do the task.
                </li>
                <li>
                  The Requester global rating will be negatively affected because they cancelled.
                </li>
                <li>If The requester cancels often they will be banned from BidOrBoo</li>
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
