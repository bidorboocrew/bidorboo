import React from 'react';
import { Collapse } from 'react-collapse';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';
import {
  UserGivenTitle,
  JobCardTitle,
  CountDownComponent,
  StartDateAndTime,
  TaskImagesCarousel,
  SummaryStartDateAndTime,
  DisputedBy,
} from '../../containers/commonComponents';

import TASKS_DEFINITIONS from '../tasksDefinitions';

export default class TaskerMyDisputedBidSummary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showDeleteDialog: false,
      showMoreOptionsContextMenu: false,
      showMore: false,
    };
  }

  render() {
    const { bid, job } = this.props;

    if (!bid || !job) {
      return <div>TaskerMyDisputedBidSummary is missing properties</div>;
    }

    const {
      _ownerRef,
      startingDateAndTime,
      addressText,
      isPastDue,
      isHappeningSoon,
      isHappeningToday,
      taskImages = [],
      jobTitle,
      jobCompletion,
    } = job;
    if (
      !startingDateAndTime ||
      !addressText ||
      isHappeningSoon === 'undefined' ||
      isHappeningToday === 'undefined' ||
      isPastDue === 'undefined' ||
      !jobCompletion
    ) {
      return <div>TaskerMyDisputedBidSummary is missing properties</div>;
    }
    const { TITLE, ICON, IMG } = TASKS_DEFINITIONS[`${job.templateId}`];
    if (!TITLE) {
      return <div>TaskerMyDisputedBidSummary is missing properties</div>;
    }
    const { displayStatus, bidAmount, _id } = bid;
    if (!displayStatus || !bidAmount || !_id) {
      return <div>TaskerMyDisputedBidSummary is missing properties</div>;
    }
    // xxx get currency from processed payment
    const { value: bidValue, currency: bidCurrency } = bidAmount;
    if (!bidValue || !bidCurrency) {
      return <div>TaskerMyDisputedBidSummary is missing properties</div>;
    }

    let whoDisputed = '';
    const { displayName } = _ownerRef;
    const { bidderDisputed, proposerDisputed } = jobCompletion;
    debugger
    if (proposerDisputed) {
      whoDisputed = displayName;
    } else {
      whoDisputed = 'You';
    }
    return (
      <div className={`card has-text-centered disputeOnlyView cardWithButton`}>
        <div className="card-content">
          <div className="content">
            <JobCardTitle icon={ICON} title={TITLE} img={IMG} />
            <UserGivenTitle userGivenTitle={jobTitle} />

            <TaskImagesCarousel taskImages={taskImages} />

            <SummaryStartDateAndTime date={startingDateAndTime} />

            <DisputedBy name={whoDisputed} />
          </div>
        </div>

        <div className="centeredButtonInCard">
          <a
            style={{ position: 'relative' }}
            onClick={() => {
              switchRoute(
                ROUTES.CLIENT.BIDDER.dynamicReviewMyAwardedBidAndTheRequestDetails(bid._id),
              );
            }}
            className="button is-fullwidth is-danger"
          >
            VIEW DETAILS
          </a>
        </div>
      </div>
    );
  }
}
