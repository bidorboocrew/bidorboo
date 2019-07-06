import React from 'react';
import {
  CountDownComponent,
  StartDateAndTime,
  DisplayShortAddress,
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
    const { TITLE, ICON } = TASKS_DEFINITIONS[`${job.templateId}`];
    if (!TITLE) {
      return <div>RequesterCanceledByRequesterSummary is missing properties</div>;
    }
    const { displayName: ownerDisplayName } = _ownerRef;

    return (
      <div className="card readOnlyView cardWithButton">
        {/* <div className="card-image">
          <img className="bdb-cover-img" src={IMG_URL} />
        </div> */}
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
            {state === REQUEST_STATES.AWARDED_CANCELED_BY_REQUESTER && (
              <div className="field">
                <label className="label">Request Status</label>
                <div className="control has-text-danger">{displayStatus}</div>
                <div className="help">{`* This was canceled by ${ownerDisplayName}`}</div>
              </div>
            )}

            {state === REQUEST_STATES.AWARDED_CANCELED_BY_BIDDER && (
              <div className="field">
                <label className="label">Request Status</label>
                <div className="control">{displayStatus}</div>
                {`* This was canceled by ${_bidderRef.displayName}`}
              </div>
            )}

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
              className="button is-danger"
            >
              View Implications
            </a>
          </div>
        </React.Fragment>
      </div>
    );
  }
}
