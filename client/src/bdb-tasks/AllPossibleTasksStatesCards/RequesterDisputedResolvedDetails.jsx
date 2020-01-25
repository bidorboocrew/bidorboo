import React from 'react';
import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
import {
  CountDownComponent,
  ResolvedDispute,
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

            <ResolvedDispute name={whoDisputed} />
            <div className="group has-text-left">
              <label className="label has-text-dark">Our Support Team Resolution:</label>
              <ul>
                <li>
                  <p className="has-text-weight-bold">
                    {dispute &&
                    dispute.bidOrBooCrewResolution &&
                    dispute.bidOrBooCrewResolution.requesterResolution
                      ? `${dispute.bidOrBooCrewResolution.requesterResolution}`
                      : 'Please contact us at bidorboo@bidorboo.ca or use the chat button in the footer to get in touch with our support team'}
                  </p>
                </li>
                <li>BidOrBoo Support decisions are final as per our Terms Of Service agreement</li>
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
