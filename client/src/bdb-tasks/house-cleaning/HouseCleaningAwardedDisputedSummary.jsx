import React from 'react';
import {
  CountDownComponent,
  StartDateAndTime,
  DisplayShortAddress,
} from '../../containers/commonComponents';
import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';

import { HOUSE_CLEANING_DEF } from './houseCleaningDefinition';

export default class HouseCleaningAwardedDisputedSummary extends React.Component {
  render() {
    const { job } = this.props;
    if (!job) {
      return <div>HouseCleaningAwardedDisputedSummary is missing properties</div>;
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
      return <div>HouseCleaningAwardedDisputedSummary is missing properties</div>;
    }
    const { _bidderRef } = _awardedBidRef;
    if (!_bidderRef) {
      return <div>HouseCleaningAwardedDisputedSummary is missing properties</div>;
    }
    const { TITLE } = HOUSE_CLEANING_DEF;
    if (!TITLE) {
      return <div>HouseCleaningAwardedDisputedSummary is missing properties</div>;
    }

    return (
      <div className="card disputeOnlyView limitWidthOfCard">
        <div className="card-content">
          <div className="content">
            <div style={{ display: 'flex' }}>
              <div style={{ flexGrow: 1 }} className="is-size-4 has-text-weight-bold">
                <span className="icon">
                  <i className="fas fa-home" />
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

            <div className="field">
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
            <DisplayShortAddress addressText={addressText} />
          </div>
        </div>

        <React.Fragment>
          <div style={{ padding: '0.5rem' }}>
            <hr className="divider isTight" />
          </div>
          <div style={{ padding: '0 0.5rem 0.5rem 0.5rem' }}>
            <a
              style={{ position: 'relative' }}
              onClick={() => {
                switchRoute(ROUTES.CLIENT.PROPOSER.dynamicSelectedAwardedJobPage(job._id));
              }}
              className="button is-outlined is-fullwidth is-danger"
            >
              View Disputed Task
            </a>
          </div>
        </React.Fragment>
      </div>
    );
  }
}
