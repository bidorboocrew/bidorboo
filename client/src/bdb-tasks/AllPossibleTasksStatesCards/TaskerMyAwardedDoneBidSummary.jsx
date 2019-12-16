import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { proposerConfirmsJobCompletion } from '../../app-state/actions/jobActions';
import { showLoginDialog } from '../../app-state/actions/uiActions';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';
import {
  CountDownComponent,
  TaskIsFulfilled,
  JobCardTitle,
  SummaryStartDateAndTime,
  ArchiveTask,
  TaskImagesCarousel,
  UserGivenTitle,
  TaskerWillEarn,
} from '../../containers/commonComponents';

import TASKS_DEFINITIONS from '../tasksDefinitions';

export default class TaskerMyAwardedDoneBidSummary extends React.Component {
  render() {
    const { bid, job } = this.props;

    const { startingDateAndTime, _reviewRef, taskImages = [], jobTitle } = job;

    const { TITLE, ICON, IMG } = TASKS_DEFINITIONS[`${job.templateId}`];

    const { bidderPayout } = bid;
    const { value: taskerTotalPayoutAmount } = bidderPayout;

    const { requiresBidderReview } = _reviewRef || {
      revealToBoth: false,
      requiresProposerReview: true,
      requiresBidderReview: true,
    };

    return (
      <div className={`card has-text-centered cardWithButton`}>
        <div className="card-content">
          <div className="content">
            <JobCardTitle icon={ICON} title={TITLE} img={IMG} />
            <UserGivenTitle userGivenTitle={jobTitle} />

            <TaskImagesCarousel taskImages={taskImages} />
            <SummaryStartDateAndTime
              date={startingDateAndTime}
              renderHelpComponent={() => <CountDownComponent startingDate={startingDateAndTime} />}
            />
            <TaskerWillEarn earningAmount={taskerTotalPayoutAmount} />

            {!requiresBidderReview && <ArchiveTask />}

            {requiresBidderReview && <TaskIsFulfilled />}
          </div>
        </div>
        {requiresBidderReview && (
          <div className="centeredButtonInCard">
            <a
              onClick={() => {
                switchRoute(
                  ROUTES.CLIENT.BIDDER.dynamicReviewMyAwardedBidAndTheRequestDetails(bid._id),
                );
              }}
              className={`button is-primary`}
            >
              REVIEW REQUESTER
            </a>
          </div>
        )}
        {!requiresBidderReview && (
          <div className="centeredButtonInCard">
            <a
              onClick={() => {
                switchRoute(
                  ROUTES.CLIENT.BIDDER.dynamicReviewMyAwardedBidAndTheRequestDetails(bid._id),
                );
              }}
              className={`button is-dark`}
            >
              PAST TASK
            </a>
          </div>
        )}
      </div>
    );
  }
}
