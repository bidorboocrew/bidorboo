import React from 'react';
import {
  CountDownComponent,
  StartDateAndTime,
  DisplayShortAddress,
  UserImageAndRating,
} from '../../containers/commonComponents';

import { HOUSE_CLEANING_DEF } from './houseCleaningDefinition';
const states = {
  OPEN: 'OPEN',
  AWARDED: 'AWARDED',
  DISPUTED: 'DISPUTED',
  AWARDED_CANCELED_BY_BIDDER: 'AWARDED_CANCELED_BY_BIDDER',
  AWARDED_CANCELED_BY_REQUESTER: 'AWARDED_CANCELED_BY_REQUESTER',
  CANCELED_OPEN: 'CANCELED_OPEN',
  DONE: 'DONE',
  PAIDOUT: 'PAIDOUT',
};
export default class HouseCleaningCanceledAwardedRequestSummary extends React.Component {
  render() {
    const { job } = this.props;

    const { startingDateAndTime, addressText, _awardedBidRef, displayStatus } = job;

    const { bidAmount, _bidderRef } = _awardedBidRef;

    const { TITLE, IMG_URL } = HOUSE_CLEANING_DEF;

    return (
      <div className="card limitWidthOfCard">
        <div className="card-image">
          <img className="bdb-cover-img" src={IMG_URL} />
        </div>
        <div className="card-content">
          <div className="content">
            <div style={{ display: 'flex' }}>
              <div style={{ flexGrow: 1 }} className="is-size-4 has-text-weight-bold">
                {TITLE}
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

            {displayStatus === states.AWARDED_CANCELED_BY_REQUESTER && (
              <div className="field">
                <label className="label">Request Status</label>
                <div className="control">{displayStatus}</div>
                <div className="help has-text-danger">
                  * This was cancelled after a Tasker was assigned. The requester gets only 80% of
                  the total payment as a refund
                </div>
                <div className="help has-text-danger">
                  * Cancelling many awarded jobs in a row will put a ban on your account
                </div>
              </div>
            )}

            {displayStatus === states.AWARDED_CANCELED_BY_BIDDER && (
              <div className="field">
                <label className="label">Request Status</label>
                <div className="control">{displayStatus}</div>
                <div className="help has-text-danger">
                  * This was cancelled after agreement was made. The requester gets 100% of the
                  payment as refund.
                </div>
                <div className="help has-text-danger">
                  * The assigned Tasker's global rating will be impacted. Cancelling too many
                  commitments may put a ban on the Tasker's account.
                </div>
              </div>
            )}

            <div className="field">
              <label className="label">Total Cost</label>
              <div className="control has-text-success">
                {bidAmount && ` ${bidAmount.value}$ (${bidAmount.currency})`}
              </div>
              {displayStatus === states.AWARDED_CANCELED_BY_REQUESTER && (
                <div className="help has-text-danger">
                  * will refund 100% of the payment to your card.
                </div>
              )}
              {displayStatus === states.AWARDED_CANCELED_BY_BIDDER && (
                <div className="help has-text-success">
                  {`* will be refunded at 80% of your payment. You will recieve <strong>${bidAmount.value *
                    0.8}</strong>`}
                </div>
              )}
            </div>
            <StartDateAndTime
              date={startingDateAndTime}
              renderHelpComponent={() => (
                <CountDownComponent startingDate={startingDateAndTime} isJobStart={false} />
              )}
            />
            <DisplayShortAddress addressText={addressText} />
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
