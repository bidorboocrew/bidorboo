import React from 'react';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';
import {
  SummaryStartDateAndTime,
  RequestCardTitle,
  TaskImagesCarousel,
  UserGivenTitle,
  ResolvedDispute,
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

            <ResolvedDispute name={whoDisputed} />

            <BidAmount bidAmount={bidValue} />
            {/* <TaskerWillEarn earningAmount={taskerPayoutAmount}></TaskerWillEarn> */}

            <div className="group has-text-left">
              <label className="label has-text-dark">Our Support Team Resolution:</label>
              <ul>
                <li>
                  <p className="has-text-weight-bold">
                    {dispute &&
                    dispute.bidOrBooCrewResolution &&
                    dispute.bidOrBooCrewResolution.taskerResolution
                      ? `${dispute.bidOrBooCrewResolution.taskerResolution}`
                      : 'Please contact us at bidorboo@bidorboo.ca or use the chat button in the footer to get in touch with our support team'}
                  </p>
                </li>
                <li>BidOrBoo Support decisions are final as per our Terms Of Service agreement</li>
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
