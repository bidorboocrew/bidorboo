import React from 'react';
import {
  CountDownComponent,
  SummaryStartDateAndTime,
  JobCardTitle,
  CancelledBy,
  TaskImagesCarousel,
} from '../../containers/commonComponents';
import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';

import TASKS_DEFINITIONS from '../tasksDefinitions';

import { REQUEST_STATES } from '../index';

export default class RequesterCanceledByRequesterSummary extends React.Component {
  render() {
    const { job } = this.props;

    if (!job) {
      return <div>RequesterCanceledByRequesterSummary is missing properties</div>;
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
      return <div>RequesterCanceledByRequesterSummary is missing properties</div>;
    }
    const { _bidderRef } = _awardedBidRef;
    if (!_bidderRef) {
      return <div>RequesterCanceledByRequesterSummary is missing properties</div>;
    }
    const { TITLE, ICON, IMG } = TASKS_DEFINITIONS[`${job.templateId}`];
    if (!TITLE) {
      return <div>RequesterCanceledByRequesterSummary is missing properties</div>;
    }

    return (
      <div
        style={{ border: '1px solid #ee2a36' }}
        className="card has-text-centered cardWithButton"
      >
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

            <CancelledBy name={'You'} refundAmount={75} />
          </div>
        </div>

        <div className="centeredButtonInCard">
          <a
            onClick={() => {
              switchRoute(ROUTES.CLIENT.PROPOSER.dynamicSelectedAwardedJobPage(job._id));
            }}
            className="button is-danger"
          >
            View details
          </a>
        </div>
      </div>
    );
  }
}
