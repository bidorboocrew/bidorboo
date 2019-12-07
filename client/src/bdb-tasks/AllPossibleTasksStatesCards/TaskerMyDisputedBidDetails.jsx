import React from 'react';
import { Collapse } from 'react-collapse';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';
import {
  CountDownComponent,
  StartDateAndTime,
  SummaryStartDateAndTime,
  JobCardTitle,
  TaskImagesCarousel,
  UserGivenTitle,
  DisputedBy,
  TaskerWillEarn,
} from '../../containers/commonComponents';
import { getChargeDistributionDetails } from '../../containers/commonUtils';

import TASKS_DEFINITIONS from '../tasksDefinitions';

export default class TaskerMyDisputedBidDetails extends React.Component {
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
      return <div>TaskerMyDisputedBidDetails is missing properties</div>;
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

      dispute,
    } = job;
    if (
      !startingDateAndTime ||
      !addressText ||
      isHappeningSoon === 'undefined' ||
      isHappeningToday === 'undefined' ||
      isPastDue === 'undefined' ||
      !dispute
    ) {
      return <div>TaskerMyDisputedBidDetails is missing properties</div>;
    }
    const { TITLE, ICON, IMG } = TASKS_DEFINITIONS[`${job.templateId}`];
    if (!TITLE) {
      return <div>TaskerMyDisputedBidDetails is missing properties</div>;
    }
    const { displayStatus, bidAmount, _id } = bid;
    if (!displayStatus || !bidAmount || !_id) {
      return <div>TaskerMyDisputedBidDetails is missing properties</div>;
    }
    // xxx get currency from processed payment
    const { value: bidValue, currency: bidCurrency } = bidAmount;
    if (!bidValue || !bidCurrency) {
      return <div>TaskerMyDisputedBidDetails is missing properties</div>;
    }

    let whoDisputed = '';
    const { displayName } = _ownerRef;
    const { taskerDispute, proposerDispute } = dispute;

    if (proposerDispute && proposerDispute.reason) {
      whoDisputed = 'Requester';
    } else {
      whoDisputed = 'You';
    }
    const { taskerTotalPayoutAmount } = getChargeDistributionDetails(bidValue);

    return (
      <div className="card has-text-centered disputeOnlyView cardWithButton nofixedwidth">
        <div className="card-content">
          <div className="content">
            <JobCardTitle icon={ICON} title={TITLE} img={IMG} />
            <UserGivenTitle userGivenTitle={jobTitle} />

            <TaskImagesCarousel taskImages={taskImages} />

            <SummaryStartDateAndTime date={startingDateAndTime} />
            <TaskerWillEarn earningAmount={taskerTotalPayoutAmount}></TaskerWillEarn>

            <DisputedBy name={whoDisputed} />

            <div className="group has-text-left">
              <label className="label has-text-danger">What you need to know:</label>
              <ul>
                <li>BidorBooCrew will assess the dispute asap to ensure your satisfaction</li>
                <li>
                  <strong>Your bid ${bidValue} will be on hold until we resolve the dispute</strong>
                </li>
                <li>Our customer relation team will be in touch with requester to gather facts</li>
                <li>We will get in touch with you to update you regularly with the status</li>
              </ul>
            </div>
          </div>

          <div style={{ padding: '0 0.5rem 0.5rem 0.5rem' }}>
            <a
              onClick={() => {
                switchRoute(ROUTES.CLIENT.BIDDER.mybids);
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
