import React from 'react';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';
import {
  SummaryStartDateAndTime,
  JobCardTitle,
  TaskImagesCarousel,
  UserGivenTitle,
  DisputedBy,
  TaskerWillEarn,
} from '../../containers/commonComponents';
import TASKS_DEFINITIONS from '../tasksDefinitions';

export default class TaskerMyDisputedBidDetails extends React.Component {
  render() {
    const { bid, job } = this.props;

    const { _ownerRef, startingDateAndTime, taskImages = [], jobTitle, dispute } = job;

    const { TITLE, ICON, IMG } = TASKS_DEFINITIONS[`${job.templateId}`];

    const { bidderPayout } = bid;

    const { value: bidderPayoutAmount } = bidderPayout;

    let whoDisputed = '';
    const { proposerDispute } = dispute;
    if (proposerDispute && proposerDispute.reason) {
      whoDisputed = 'Requester';
    } else {
      whoDisputed = 'You';
    }

    return (
      <div className="card has-text-centered disputeOnlyView cardWithButton nofixedwidth">
        <div className="card-content">
          <div className="content">
            <JobCardTitle icon={ICON} title={TITLE} img={IMG} />
            <UserGivenTitle userGivenTitle={jobTitle} />

            <TaskImagesCarousel taskImages={taskImages} />

            <SummaryStartDateAndTime date={startingDateAndTime} />
            <TaskerWillEarn earningAmount={bidderPayoutAmount}></TaskerWillEarn>

            <DisputedBy name={whoDisputed} />

            <div className="group has-text-left">
              <label className="label has-text-danger">What you need to know:</label>
              <ul>
                <li>
                  BidOrBoo support crew will assess the dispute asap to ensure your satisfaction
                </li>
                <li>
                  <strong>
                    Your bid ${bidderPayoutAmount} will be on hold until we resolve the dispute
                  </strong>
                </li>
                <li>Our customer relation team will be in touch with requester to gather facts</li>
                <li>We will get in touch with you to update you regularly with the status</li>
              </ul>
            </div>
          </div>

          <div style={{ padding: '0 0.5rem 0.5rem 0.5rem' }}>
            <a
              onClick={() => {
                switchRoute(ROUTES.CLIENT.BIDDER.mybids);
              }}
              className={`button firstButtonInCard`}
              style={{ flexGrow: 1, marginRight: 10 }}
            >
              <span className="icon">
                <i className="far fa-arrow-alt-circle-left" />
              </span>
              <span>I understand</span>
            </a>
          </div>
        </div>
      </div>
    );
  }
}
