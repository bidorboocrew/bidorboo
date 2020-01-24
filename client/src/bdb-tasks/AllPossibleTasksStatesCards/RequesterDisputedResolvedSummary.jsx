import React from 'react';
import {
  CountDownComponent,
  ResolvedDispute,
  SummaryStartDateAndTime,
  RequestCardTitle,
  TaskImagesCarousel,
  UserGivenTitle,
} from '../../containers/commonComponents';
import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';

import TASKS_DEFINITIONS from '../tasksDefinitions';

export default class RequesterDisputedSummary extends React.Component {
  render() {
    const { request } = this.props;

    const { startingDateAndTime, taskImages = [], requestTitle, dispute } = request;

    const { TITLE, ICON, IMG } = TASKS_DEFINITIONS[`${request.templateId}`];

    let whoDisputed = '';

    const { taskerDispute } = dispute;
    if (taskerDispute && taskerDispute.reason) {
      whoDisputed = 'Tasker';
    } else {
      whoDisputed = 'You';
    }

    return (
      <div className="card has-text-centered disputeOnlyView cardWithButton">
        <div className="card-content">
          <div className="content">
            <RequestCardTitle
              icon={ICON}
              title={TITLE}
              img={taskImages && taskImages.length > 0 ? taskImages[0].url : IMG}
            />
            <UserGivenTitle userGivenTitle={requestTitle} />

            <SummaryStartDateAndTime
              date={startingDateAndTime}
              renderHelpComponent={() => <CountDownComponent startingDate={startingDateAndTime} />}
            />
            <ResolvedDispute name={whoDisputed} />
          </div>
        </div>

        <React.Fragment>
          <div className="centeredButtonInCard">
            <a
              onClick={() => {
                switchRoute(ROUTES.CLIENT.REQUESTER.dynamicSelectedAwardedRequestPage(request._id));
              }}
              className="button is-danger"
            >
              View Details
            </a>
          </div>
        </React.Fragment>
      </div>
    );
  }
}
