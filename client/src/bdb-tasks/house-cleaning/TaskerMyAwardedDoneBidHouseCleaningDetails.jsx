import React from 'react';
import ReactDOM from 'react-dom';
import TextareaAutosize from 'react-autosize-textarea';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { bidderConfirmsJobCompletion } from '../../app-state/actions/jobActions';
import { showLoginDialog } from '../../app-state/actions/uiActions';
import { cancelAwardedBid } from '../../app-state/actions/bidsActions';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
import {
  CountDownComponent,
  StartDateAndTime,
  DisplayLabelValue,
  UserImageAndRating,
  AddAwardedJobToCalendar,
  EffortLevel,
} from '../../containers/commonComponents';

import { HOUSE_CLEANING_DEF } from './houseCleaningDefinition';
import RequestBaseContainer from '../RequestBaseContainer';
import { Spinner } from '../../components/Spinner';

class TaskerMyAwardedBidHouseCleaningDetails extends RequestBaseContainer {
  render() {
    const { bid, cancelAwardedBid, currentUserDetails } = this.props;
    if (!bid || !bid._id || !currentUserDetails) {
      return switchRoute(ROUTES.CLIENT.BIDDER.mybids);
    }
    const { _jobRef: job, _id: bidId } = bid;
    const { _id: bidderId } = currentUserDetails;
    if (!job) {
      return switchRoute(ROUTES.CLIENT.BIDDER.mybids);
    }

    const {
      _id: jobId,
      startingDateAndTime,
      addressText,
      extras,
      detailedDescription,
      displayStatus,
      _ownerRef,
      _reviewRef = {
        revealToBoth: false,
        requiresProposerReview: true,
        requiresBidderReview: true,
      },
    } = job;
    if (
      !startingDateAndTime ||
      !addressText ||
      !extras ||
      !detailedDescription ||
      !displayStatus ||
      !_ownerRef
    ) {
      return switchRoute(ROUTES.CLIENT.BIDDER.mybids);
    }

    const { bidAmount } = bid;
    if (!bidAmount) {
      return switchRoute(ROUTES.CLIENT.BIDDER.mybids);
    }

    // xxx get currency from processed payment
    const { value: bidValue, currency: bidCurrency } = bidAmount;
    if (!bidValue || !bidCurrency) {
      return switchRoute(ROUTES.CLIENT.BIDDER.mybids);
    }
    const { revealToBoth, requiresProposerReview, requiresBidderReview } = _reviewRef;

    const { TITLE } = HOUSE_CLEANING_DEF;
    if (!TITLE) {
      return switchRoute(ROUTES.CLIENT.BIDDER.mybids);
    }

    const { showDeleteDialog, showMoreOptionsContextMenu, showMore } = this.state;

    return (
      <React.Fragment>
        <div style={{ height: 'auto' }} className="card">
          <div className="card-content">
            <div className="content">
              <div style={{ display: 'flex' }}>
                <div style={{ flexGrow: 1 }} className="is-size-4 has-text-weight-bold">
                  <span className="icon">
                    <i className="fas fa-home" />
                  </span>
                  <span style={{ marginLeft: 4 }}>{TITLE}</span>
                </div>

                <div
                  ref={(node) => (this.node = node)}
                  className={`dropdown is-right ${showMoreOptionsContextMenu ? 'is-active' : ''}`}
                >
                  <div className="dropdown-trigger">
                    <button
                      onClick={this.toggleShowMoreOptionsContextMenu}
                      className="button"
                      aria-haspopup="true"
                      aria-controls="dropdown-menu"
                      style={{ border: 'none' }}
                    >
                      <div style={{ padding: 6 }} className="icon">
                        <i className="fas fa-ellipsis-v" />
                      </div>
                    </button>
                  </div>
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

              {!requiresBidderReview && (
                <div className="field">
                  <label className="label">Request Status</label>
                  <div className="control has-text-link">Archived !</div>
                  <div className="help">* Congratulations. This was a success</div>
                </div>
              )}

              {requiresBidderReview && (
                <div className="field">
                  <label className="label">Request Status</label>
                  <div className="control has-text-success">Done!</div>
                  <div className="help">
                    * Congratulations. Now it is time to review the Requester
                  </div>
                </div>
              )}

              <div className="field">
                <label className="label">My Payout</label>
                <div className="control">{`${bidValue -
                  Math.ceil(bidValue * 0.04)}$ (${bidCurrency})`}</div>
                <div className="help">* Paid Out</div>
              </div>

              <StartDateAndTime
                date={startingDateAndTime}
                renderHelpComponent={() => (
                  <CountDownComponent startingDate={startingDateAndTime} isJobStart={false} />
                )}
              />

              <DisplayLabelValue labelText="Address" labelValue={addressText} />

              {showMore && (
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
                        }}
                        readOnly
                      />
                    </span>
                  </div>
                </React.Fragment>
              )}
              <div>
                {!showMore && (
                  <a onClick={this.toggleShowMore} className="button is-small is-outlined">
                    <span style={{ marginRight: 4 }}>show full details</span>
                    <span className="icon">
                      <i className="fas fa-angle-double-down" />
                    </span>
                  </a>
                )}
                {showMore && (
                  <a onClick={this.toggleShowMore} className="button is-small is-outlined">
                    <span style={{ marginRight: 4 }}>show less details</span>
                    <span className="icon">
                      <i className="fas fa-angle-double-up" />
                    </span>
                  </a>
                )}
              </div>
              <hr className="divider" />
              <div className="field">
                <label className="label">Requester Details</label>
                <UserImageAndRating userDetails={_ownerRef} />
              </div>
            </div>
          </div>
          <hr className="divider isTight" />
          <div style={{ padding: '0.5rem', display: 'flex' }}>
            {requiresBidderReview && (
              <a
                onClick={() => {
                  switchRoute(ROUTES.CLIENT.REVIEW.getBidderJobReview({ jobId }));
                }}
                className={`button hearbeatInstant is-fullwidth is-success`}
              >
                Review Requester
              </a>
            )}
            {!requiresBidderReview && (
              <a
                onClick={() => {
                  alert('Archive not implemented yet, will take you to archieve');
                }}
                className={`button is-fullwidth is-link is-outlined`}
              >
                View In Archive
              </a>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ jobsReducer, userReducer, uiReducer }) => {
  return {
    isLoggedIn: userReducer.isLoggedIn,
    selectedAwardedJob: jobsReducer.selectedAwardedJob,
    currentUserDetails: userReducer.userDetails,
    notificationFeed: uiReducer.notificationFeed,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    bidderConfirmsJobCompletion: bindActionCreators(bidderConfirmsJobCompletion, dispatch),
    cancelAwardedBid: bindActionCreators(cancelAwardedBid, dispatch),
    showLoginDialog: bindActionCreators(showLoginDialog, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TaskerMyAwardedBidHouseCleaningDetails);
