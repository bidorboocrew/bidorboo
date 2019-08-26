import React from 'react';
import { Collapse } from 'react-collapse';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';
import { CountDownComponent, StartDateAndTime } from '../../containers/commonComponents';

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

    const { startingDateAndTime, addressText, isPastDue, isHappeningSoon, isHappeningToday } = job;
    if (
      !startingDateAndTime ||
      !addressText ||
      isHappeningSoon === 'undefined' ||
      isHappeningToday === 'undefined' ||
      isPastDue === 'undefined'
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

    return (
      <div className={`card disputeOnlyView limitWidthOfCard`}>
        <div className="card-content">
          <div className="content">
            <div style={{ display: 'flex' }}>
              <div style={{ flexGrow: 1 }} className="is-size-4 has-text-weight-bold">
                <span className="icon">
                  <i className={ICON} />
                </span>
                <span style={{ marginLeft: 4 }}>{TITLE}</span>
              </div>
            </div>
            <div
              style={{
                backgroundColor: ' whitesmoke',
                border: 'none',
                display: 'block',
                height: 2,
                margin: '0.5rem 0',
              }}
              className="navbar-divider"
            />

            <div className="group">
              <label className="label">Request Status</label>
              <div className="control has-text-danger">Disputed</div>
              <div className="help">* BidorBooCrew will resolve this asap</div>
            </div>

            <div className="group">
              <label className="label hasSelectedValue">My Bid</label>
              <div className={`has-text-danger`}>${bidValue}</div>
              <div className="help">* on hold</div>
            </div>
            <StartDateAndTime
              date={startingDateAndTime}
              renderHelpComponent={() => (
                <CountDownComponent startingDate={startingDateAndTime} isJobStart={false} />
              )}
            />
          </div>
        </div>

        <div style={{ padding: '0 0.5rem 0.5rem 0.5rem' }}>
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
