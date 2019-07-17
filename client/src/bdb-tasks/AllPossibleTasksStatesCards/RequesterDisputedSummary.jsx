import React from 'react';
import {
  CountDownComponent,
  StartDateAndTime,
  DisplayShortAddress,
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
    const { TITLE, ICON } = TASKS_DEFINITIONS[`${job.templateId}`];
    if (!TITLE) {
      return <div>RequesterDisputedSummary is missing properties</div>;
    }

    return (
      <div className="card disputeOnlyView cardWithButton">
        <div className="card-content">
          <div className="content">
            <div style={{ display: 'flex' }}>
              <div style={{ flexGrow: 1 }} className="title">
                <span className="icon">
                  <i className={ICON} />
                </span>
                <span style={{ marginLeft: 7 }}>{TITLE}</span>
              </div>
            </div>

            <div className="group saidTest">
              <label className="label">Request Status</label>
              <div className="control has-text-danger">{displayStatus}</div>
              <div className="help">* BidorBooCrew will resolve this asap</div>
            </div>

            <StartDateAndTime
              date={startingDateAndTime}
              renderHelpComponent={() => (
                <CountDownComponent startingDate={startingDateAndTime} isJobStart={false} />
              )}
            />
            {/* <DisplayShortAddress addressText={addressText} /> */}
          </div>
        </div>

        <React.Fragment>
          <div className="firstButtonInCard">
            <a
              style={{ position: 'relative' }}
              onClick={() => {
                switchRoute(ROUTES.CLIENT.PROPOSER.dynamicSelectedAwardedJobPage(job._id));
              }}
              className="button is-fullwidth is-danger"
            >
              View Dispute
            </a>
          </div>
        </React.Fragment>
      </div>
    );
  }
}
