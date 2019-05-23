import React from 'react';
import {
  CountDownComponent,
  StartDateAndTime,
  DisplayShortAddress,
} from '../../containers/commonComponents';
import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';

import { HOUSE_CLEANING_DEF } from './houseCleaningDefinition';

import { REQUEST_STATES } from '../index';

export default class HouseCleaningAwardedCanceledByRequesterSummary extends React.Component {
  render() {
    const { job } = this.props;

    const {
      startingDateAndTime,
      addressText,
      _awardedBidRef,
      displayStatus,
      state,
      _ownerRef,
    } = job;
    debugger;
    const { _bidderRef } = _awardedBidRef;

    const { TITLE } = HOUSE_CLEANING_DEF;

    const { displayName: ownerDisplayName } = _ownerRef;

    return (
      <div className="card readOnlyView limitWidthOfCard">
        {/* <div className="card-image">
          <img className="bdb-cover-img" src={IMG_URL} />
        </div> */}
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

            {state === REQUEST_STATES.AWARDED_CANCELED_BY_REQUESTER && (
              <div className="field">
                <label className="label">Request Status</label>
                <div className="control">{displayStatus}</div>
                <div className="help has-text-danger">
                  {`* This was canceled by ${ownerDisplayName}`}
                </div>
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
              className="button is-outlined is-danger"
            >
              View Implications
            </a>
          </div>
        </React.Fragment>
      </div>
    );
  }
}
