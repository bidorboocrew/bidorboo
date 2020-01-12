import React from 'react';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';
import {
  SummaryStartDateAndTime,
  RequestCardTitle,
  TaskImagesCarousel,
  UserGivenTitle,
  DisputedBy,
  TaskerWillEarn,
  BidAmount,
} from '../../containers/commonComponents';
import TASKS_DEFINITIONS from '../tasksDefinitions';

export default class TaskerMyDisputedBidDetails extends React.Component {
  render() {
    const { bid, request } = this.props;

    const { startingDateAndTime, taskImages = [], requestTitle, dispute } = request;

    const { TITLE, ICON, IMG } = TASKS_DEFINITIONS[`${request.templateId}`];

    const { taskerPayout, bidAmount } = bid;
    const { value: bidValue } = bidAmount;
    const { value: taskerPayoutAmount } = taskerPayout;

    let whoDisputed = '';
    const { requesterDispute } = dispute;
    if (requesterDispute && requesterDispute.reason) {
      whoDisputed = 'Requester';
    } else {
      whoDisputed = 'You';
    }

    return (
      <div className="card has-text-centered disputeOnlyView cardWithButton nofixedwidth">
        <div className="card-content">
          <div className="content">
            <RequestCardTitle icon={ICON} title={TITLE} img={IMG} />
            <UserGivenTitle userGivenTitle={requestTitle} />

            <TaskImagesCarousel taskImages={taskImages} />

            <SummaryStartDateAndTime date={startingDateAndTime} />
            <BidAmount bidAmount={bidValue} />

            <TaskerWillEarn earningAmount={taskerPayoutAmount}></TaskerWillEarn>

            <DisputedBy name={whoDisputed} />

            <div className="group has-text-left">
              <label className="label has-text-danger">What you need to know:</label>
              <ul>
                <li>
                  <strong>
                    Your expected earnings ${taskerPayoutAmount} will be on hold until we resolve
                    the dispute
                  </strong>
                </li>
                <li>
                  BidOrBoo support crew will assess the dispute asap to resolve and ensure your
                  satisfaction
                </li>
                <li>We will get in touch with you to update you regularly with the progress</li>
              </ul>
            </div>
          </div>

          <div style={{ padding: '0 0.5rem 0.5rem 0.5rem' }}>
            <a
              onClick={() => {
                switchRoute(ROUTES.CLIENT.TASKER.mybids);
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
