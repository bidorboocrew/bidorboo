import React from 'react';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
import {
  CountDownComponent,
  SummaryStartDateAndTime,
  JobCardTitle,
  CancelledBy,
  TaskImagesCarousel,
  UserGivenTitle,
  TaskCost,
} from '../../containers/commonComponents';

import TASKS_DEFINITIONS from '../tasksDefinitions';

export default class RequesterCanceledByRequesterDetails extends React.Component {
  render() {
    const { job } = this.props;

    const { startingDateAndTime, taskImages = [], jobTitle, _awardedBidRef } = job;

    const { TITLE, ICON, IMG } = TASKS_DEFINITIONS[`${job.templateId}`];

    const { requesterPartialRefund, requesterPayment } = _awardedBidRef;
    const { value: requesterPartialRefundAmount } = requesterPartialRefund;

    const { value: requesterPaymentAmount } = requesterPayment;

    return (
      <div
        style={{ border: '1px solid #ee2a36' }}
        className="card has-text-centered cardWithButton nofixedwidth"
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
            <TaskCost cost={requesterPaymentAmount}></TaskCost>

            <CancelledBy name={'You'} />
            <div className="group has-text-left">
              <label className="label has-text-danger">What you need to know:</label>
              <ul>
                <li>At BidOrBoo we takes cancellations seriously.</li>
                <li>
                  <strong>10% was deducted</strong> from the original full payment because you
                  cancelled.
                </li>
                <li>
                  <strong>{` $${requesterPartialRefundAmount}`} was refunded </strong> back to your
                  payment card.
                </li>
                <li>Your global rating will be negatively impacted</li>
                <li>Cancelling frequently will put a ban on your account.</li>
                <li>
                  You can always review the details of this task in your inbox under "Past Requests"
                  Tab
                </li>
              </ul>
            </div>
          </div>
        </div>

        <a
          onClick={() => {
            switchRoute(ROUTES.CLIENT.REQUESTER.myRequestsPage);
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
