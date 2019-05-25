import React from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
import {
  CountDownComponent,
  StartDateAndTime,
  DisplayLabelValue,
  UserImageAndRating,
  EffortLevel,
} from '../../containers/commonComponents';

import { HOUSE_CLEANING_DEF } from './houseCleaningDefinition';

import { REQUEST_STATES } from '../index';

export default class HouseCleaningAwardedCanceledByRequesterDetails extends React.Component {
  render() {
    const { job } = this.props;
    if (!job) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myOpenJobs);
    }

    const {
      startingDateAndTime,
      addressText,
      _awardedBidRef,
      displayStatus,
      state,
      extras,
      _ownerRef,
      detailedDescription,
    } = job;
    if (
      !startingDateAndTime ||
      !addressText ||
      !_awardedBidRef ||
      !displayStatus ||
      !state ||
      !extras ||
      !_ownerRef ||
      !detailedDescription
    ) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myOpenJobs);
    }
    if (!extras.effort) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myOpenJobs);
    }
    const { bidAmount, _bidderRef } = _awardedBidRef;
    if (!bidAmount || !_bidderRef) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myOpenJobs);
    }
    const { value: bidValue, currency: bidCurrency } = bidAmount;
    if (!bidValue || !bidCurrency) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myOpenJobs);
    }
    const { displayName: taskerDisplayName } = _bidderRef;
    if (!taskerDisplayName) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myOpenJobs);
    }

    const { displayName: ownerDisplayName } = _ownerRef;
    if (!ownerDisplayName) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myOpenJobs);
    }
    const { TITLE } = HOUSE_CLEANING_DEF;
    if (!TITLE) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myOpenJobs);
    }

    return (
      <div className="card readOnlyView">
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
                <div className="control has-text-danger">{displayStatus}</div>
                <div className="help">
                  {`* This was canceled by ${ownerDisplayName}`}
                  <div className="help">
                    {`* This was cancelled after agreement was made. ${ownerDisplayName} will recieve 80% of the
                  payment as refund.`}
                  </div>
                  <div className="help">
                    {`* Canceling many requests may cause your account to be locked out or banned`}
                  </div>
                </div>
              </div>
            )}

            {state === REQUEST_STATES.AWARDED_CANCELED_BY_BIDDER && (
              <div className="field">
                <label className="label">Request Status</label>
                <div className="control has-text-danger">{displayStatus}</div>
                {`* This was canceled by ${taskerDisplayName}`}
                <div className="help">
                  * This was cancelled after agreement was made view details
                </div>
              </div>
            )}

            <div className="field">
              <label className="label">Total Cost</label>
              <div className="control">{` ${bidValue}$ (${bidCurrency}) `}</div>
              {state === REQUEST_STATES.AWARDED_CANCELED_BY_REQUESTER && (
                <div className="help">* will refund 80% of the payment to your card.</div>
              )}
              {state === REQUEST_STATES.AWARDED_CANCELED_BY_BIDDER && (
                <div className="help">* will refund 100% of the payment to your card.</div>
              )}
            </div>
            <StartDateAndTime
              date={startingDateAndTime}
              renderHelpComponent={() => (
                <CountDownComponent startingDate={startingDateAndTime} isJobStart={false} />
              )}
            />
            <DisplayLabelValue labelText="Address" labelValue={addressText} />
            <React.Fragment>
              <EffortLevel extras={extras} />
              <div className="field">
                <label className="label">Detailed Description</label>
                <span className="is-size-7">
                  <TextareaAutosize
                    value={detailedDescription}
                    className="textarea is-marginless is-paddingless is-size-6"
                    style={{
                      resize: 'none',
                      border: 'none',
                      color: '#4a4a4a',
                      fontSize: '1rem',
                      background: '#eeeeee',
                    }}
                    readOnly
                  />
                </span>
              </div>
            </React.Fragment>
            <hr className="divider" />
            <div className="field">
              <label className="label">Assigned Tasker Details</label>
              <UserImageAndRating userDetails={_bidderRef} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
