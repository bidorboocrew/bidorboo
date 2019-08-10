import React from 'react';
import {
  CountDownComponent,
  DisputedBy,
  SummaryStartDateAndTime,
  JobCardTitle,
  TaskImagesCarousel,
} from '../../containers/commonComponents';
import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';

import TASKS_DEFINITIONS from '../tasksDefinitions';

export default class RequesterDisputedSummary extends React.Component {
  render() {
    const { job } = this.props;
    if (!job) {
      return <div>RequesterDisputedSummary is missing properties</div>;
    }

    const {
      startingDateAndTime,
      addressText,
      _awardedBidRef,
      displayStatus,
      state,
      _ownerRef,
      taskImages = [],
    } = job;
    if (
      !startingDateAndTime ||
      !addressText ||
      !_awardedBidRef ||
      !displayStatus ||
      !state ||
      !_ownerRef
    ) {
      return <div>RequesterDisputedSummary is missing properties</div>;
    }
    const { _bidderRef } = _awardedBidRef;
    if (!_bidderRef) {
      return <div>RequesterDisputedSummary is missing properties</div>;
    }
    const { TITLE, ICON, IMG } = TASKS_DEFINITIONS[`${job.templateId}`];
    if (!TITLE) {
      return <div>RequesterDisputedSummary is missing properties</div>;
    }

    return (
      <div className="card has-text-centered disputeOnlyView cardWithButton">
        <div className="card-content">
          <div className="content">
            <JobCardTitle icon={ICON} title={TITLE} img={IMG} />

            <TaskImagesCarousel taskImages={taskImages} />

            <SummaryStartDateAndTime
              date={startingDateAndTime}
              renderHelpComponent={() => (
                <CountDownComponent startingDate={startingDateAndTime} isJobStart={false} />
              )}
            />
            <DisputedBy name="You" />
          </div>
        </div>

        <React.Fragment>
          <div className="centeredButtonInCard">
            <a
              onClick={() => {
                switchRoute(ROUTES.CLIENT.PROPOSER.dynamicSelectedAwardedJobPage(job._id));
              }}
              className="button is-fullwidth is-danger"
            >
              View details
            </a>
          </div>
        </React.Fragment>
      </div>
    );
  }
}
