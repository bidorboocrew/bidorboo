import React from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
import {
  CountDownComponent,
  SummaryStartDateAndTime,
  JobCardTitle,
  CancelledBy,
} from '../../containers/commonComponents';
import TASKS_DEFINITIONS from '../tasksDefinitions';

export default class RequesterCanceledByTaskerDetails extends React.Component {
  render() {
    const { job } = this.props;

    if (!job) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myRequestsPage);
    }

    const {
      startingDateAndTime,
      addressText,
      _awardedBidRef,
      displayStatus,
      state,
      extras,
      _ownerRef,
      detailedDescription,
      processedPayment,
      templateId,
    } = job;
    if (
      !startingDateAndTime ||
      !addressText ||
      !_awardedBidRef ||
      !displayStatus ||
      !state ||
      !extras ||
      !_ownerRef ||
      !detailedDescription ||
      !templateId ||
      !processedPayment
    ) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myRequestsPage);
    }

    const { bidAmount, _bidderRef } = _awardedBidRef;
    if (!bidAmount || !_bidderRef) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myRequestsPage);
    }

    // xxxx get currency from processed payment
    const { value: bidValue, currency: bidCurrency } = bidAmount;
    if (!bidValue || !bidCurrency) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myRequestsPage);
    }
    const { displayName: taskerDisplayName } = _bidderRef;
    if (!taskerDisplayName) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myRequestsPage);
    }

    const { displayName: ownerDisplayName } = _ownerRef;
    if (!ownerDisplayName) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myRequestsPage);
    }
    const { TITLE, ID, ICON } = TASKS_DEFINITIONS[`${job.templateId}`];
    if (!TITLE || !ID) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myRequestsPage);
    }
    const { proposerPaid } = processedPayment;

    return (
      <div
        style={{ border: '1px solid #ee2a36' }}
        className="card has-text-centered cardWithButton nofixedwidth"
      >
        <div className="card-content">
          <div className="content">
            <JobCardTitle icon={ICON} title={TITLE} />

            <SummaryStartDateAndTime
              date={startingDateAndTime}
              renderHelpComponent={() => (
                <CountDownComponent startingDate={startingDateAndTime} isJobStart={false} />
              )}
            />

            <CancelledBy name={`Tasker ${_bidderRef.displayName}`} refundAmount={100} />
            <div className="group has-text-left">
              <label className="label">What you need to know:</label>
              <ul>
                <li>
                  We Issued a <strong>full refund</strong> for the amount of
                  <strong>{` $${proposerPaid / 100}`}</strong> back to your card.
                </li>
                <li>
                  You should recieve the money back into the same card you used within the next 3-5
                  business days
                </li>
                <li><strong>The Tasker's</strong> rating has been negatively impacted for their cancellation</li>
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
