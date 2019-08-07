import React from 'react';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';
import {
  CountDownComponent,
  StartDateAndTime,
  DisplayShortAddress,
} from '../../containers/commonComponents';

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

    const { startingDateAndTime, addressText, isPastDue, isHappeningSoon, isHappeningToday } = job;
    if (
      !startingDateAndTime ||
      !addressText ||
      isHappeningSoon === 'undefined' ||
      isHappeningToday === 'undefined' ||
      isPastDue === 'undefined'
    ) {
      return <div>TaskerMyDisputedBidDetails is missing properties</div>;
    }
    const { TITLE, ICON } = TASKS_DEFINITIONS[`${job.templateId}`];
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

    return (
      <div className={`card disputeOnlyView`}>
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
              <label className="label">My Bid</label>
              <div className={`has-text-danger`}>{`${bidValue -
                Math.ceil(bidValue * 0.04)}$ (${bidCurrency})`}</div>
              <div className="help">* on hold</div>
            </div>
            <StartDateAndTime
              date={startingDateAndTime}
              renderHelpComponent={() => (
                <CountDownComponent startingDate={startingDateAndTime} isJobStart={false} />
              )}
            />
          </div>
          <div className="group">
            <label className="label has-text-danger">What you need to know:</label>
            <div className="control">* BidorBooCrew will assess the dispute asap</div>
            <div className="control">
              * Our customer relation team will be in touch with tasker and requester to gather
              facts
            </div>
            <div className="control">
              * We will contact you asap to inform you of the next steps.
            </div>
          </div>

          <div style={{ padding: '0 0.5rem 0.5rem 0.5rem' }}>
            <a
              onClick={() => {
                switchRoute(ROUTES.CLIENT.BIDDER.mybids);
              }}
              className={`button`}
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
