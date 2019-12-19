import React from 'react';
import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
import {
  CountDownComponent,
  DisputedBy,
  SummaryStartDateAndTime,
  RequestCardTitle,
  TaskImagesCarousel,
  UserGivenTitle,
  TaskCost,
} from '../../containers/commonComponents';

import TASKS_DEFINITIONS from '../tasksDefinitions';

export default class RequesterDisputedDetails extends React.Component {
  render() {
    const { request } = this.props;
    if (!request) {
      return switchRoute(ROUTES.CLIENT.REQUESTER.myRequestsPage);
    }

    const { _awardedBidRef, startingDateAndTime, taskImages = [], requestTitle, dispute } = request;

    const { TITLE, ICON, IMG } = TASKS_DEFINITIONS[`${request.templateId}`];

    let whoDisputed = '';
    const { taskerDispute } = dispute;
    if (taskerDispute && taskerDispute.reason) {
      whoDisputed = 'Tasker';
    } else {
      whoDisputed = 'You';
    }

    const { requesterPayment } = _awardedBidRef;
    const { value: requesterPaymentAmount } = requesterPayment;
    return (
      <div className="card has-text-centered disputeOnlyView cardWithButton nofixedwidth">
        <div className="card-content">
          <div className="content">
            <RequestCardTitle icon={ICON} title={TITLE} img={IMG} />
            <UserGivenTitle userGivenTitle={requestTitle} />

            <TaskImagesCarousel taskImages={taskImages} isLarge />
            <SummaryStartDateAndTime
              date={startingDateAndTime}
              renderHelpComponent={() => <CountDownComponent startingDate={startingDateAndTime} />}
            />
            <TaskCost cost={requesterPaymentAmount}></TaskCost>

            <DisputedBy name={whoDisputed} />
            <div className="group has-text-left">
              <label className="label has-text-danger">What you need to know:</label>
              <ul>
                <li>
                  <strong>
                    Your payment ${requesterPaymentAmount} will be on hold until we resolve the
                    dispute
                  </strong>
                </li>
                <li>
                  BidOrBoo support crew will assess the dispute asap to ensure your satisfaction
                </li>

                <li>We will get in touch with you to update you regularly with the progress</li>
              </ul>
            </div>
          </div>
        </div>
        <br></br>
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
