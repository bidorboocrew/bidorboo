import React from 'react';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';
import {
  UserGivenTitle,
  JobCardTitle,
  TaskImagesCarousel,
  SummaryStartDateAndTime,
  DisputedBy,
  TaskerWillEarn,
} from '../../containers/commonComponents';

import TASKS_DEFINITIONS from '../tasksDefinitions';

export default class TaskerMyDisputedBidSummary extends React.Component {
  render() {
    const { bid, job } = this.props;

    const { startingDateAndTime, taskImages = [], jobTitle, dispute } = job;

    const { TITLE, ICON, IMG } = TASKS_DEFINITIONS[`${job.templateId}`];

    const { taskerPayout } = bid;
    const { value: taskerTotalPayoutAmount } = taskerPayout;

    let whoDisputed = '';
    const { proposerDispute } = dispute;
    if (proposerDispute && proposerDispute.reason) {
      whoDisputed = 'Requester';
    } else {
      whoDisputed = 'You';
    }

    return (
      <div className={`card has-text-centered disputeOnlyView cardWithButton`}>
        <div className="card-content">
          <div className="content">
            <JobCardTitle icon={ICON} title={TITLE} img={IMG} />
            <UserGivenTitle userGivenTitle={jobTitle} />

            <TaskImagesCarousel taskImages={taskImages} />

            <SummaryStartDateAndTime date={startingDateAndTime} />
            <TaskerWillEarn earningAmount={taskerTotalPayoutAmount}></TaskerWillEarn>

            <DisputedBy name={whoDisputed} />
          </div>
        </div>

        <div className="centeredButtonInCard">
          <a
            style={{ position: 'relative' }}
            onClick={() => {
              switchRoute(
                ROUTES.CLIENT.TASKER.dynamicReviewMyAwardedBidAndTheRequestDetails(bid._id),
              );
            }}
            className="button is-fullwidth is-danger"
          >
            VIEW DETAILS
          </a>
        </div>
      </div>
    );
  }
}
