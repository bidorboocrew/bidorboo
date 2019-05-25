import React from 'react';
import ReactDOM from 'react-dom';
import TextareaAutosize from 'react-autosize-textarea';
import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

import { HOUSE_CLEANING_DEF } from './houseCleaningDefinition';

import {
  CountDownComponent,
  UserImageAndRating,
  AvgBidDisplayLabelAndValue,
  StartDateAndTime,
  LocationLabelAndValue,
  EffortLevel,
} from '../../containers/commonComponents';

import TaskerPendingBidInfo from '../../containers/bidder-flow/components/TaskerPendingBidInfo';

import {
  getUserExistingBid,
  didUserAlreadyView,
  findAvgBidInBidList,
} from '../../containers/commonUtils';

export default class TaskerMyOpenBidHouseCleaningDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showDeleteDialog: false,
      showMoreOptionsContextMenu: false,
      showMore: false,
    };
  }

  toggleShowMore = () => {
    this.setState({ showMore: !this.state.showMore });
  };
  toggleDeleteConfirmationDialog = () => {
    this.setState({ showDeleteDialog: !this.state.showDeleteDialog });
  };

  toggleShowMoreOptionsContextMenu = (e) => {
    e.preventDefault();
    this.setState({ showMoreOptionsContextMenu: !this.state.showMoreOptionsContextMenu }, () => {
      if (this.state.showMoreOptionsContextMenu) {
        document.addEventListener('mousedown', this.handleClick, false);
      } else {
        document.removeEventListener('mousedown', this.handleClick, false);
      }
    });
  };
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick, false);
  }

  handleClick = (e) => {
    if (this.node && e.target && this.node.contains(e.target)) {
      return;
    } else {
      this.toggleShowMoreOptionsContextMenu(e);
    }
  };

  render() {
    const { bid, job, otherArgs } = this.props;

    const {
      startingDateAndTime,
      _bidsListRef,
      _ownerRef,
      detailedDescription,
      location,
      extras,
      isPastDue,
    } = job;

    const { showMore, showDeleteDialog, showMoreOptionsContextMenu } = this.state;

    const { updateBid, deleteOpenBid } = otherArgs;

    const { TITLE } = HOUSE_CLEANING_DEF;
    const { displayStatus } = bid;
    const bidAmount = bid.bidAmount.value;
    const bidCurrency = bid.bidAmount.currency;
    const isAwardedToSomeoneElse = job.state === 'AWARDED';

    return (
      <React.Fragment>
        {showDeleteDialog &&
          ReactDOM.createPortal(
            <div className="modal is-active">
              <div onClick={this.toggleDeleteConfirmationDialog} className="modal-background" />
              <div className="modal-card">
                <header className="modal-card-head">
                  <div className="modal-card-title">Delete Bid</div>
                  <button
                    onClick={this.toggleDeleteConfirmationDialog}
                    className="delete"
                    aria-label="close"
                  />
                </header>
                <section className="modal-card-body">
                  <div className="content">
                    Are you sure you want to delete your bid on this task?
                    <br />
                    You can always edit your bid price as long as the Requester did not chose a
                    tasker.
                  </div>
                  <div className="help">*This action will NOT affect your ratings.</div>
                </section>
                <footer className="modal-card-foot">
                  <button
                    onClick={this.toggleDeleteConfirmationDialog}
                    className="button is-outline"
                  >
                    <span>Go Back</span>
                  </button>
                  <button
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      deleteOpenBid(bid._id);
                      this.toggleDeleteConfirmationDialog();
                    }}
                    className="button is-danger"
                  >
                    <span className="icon">
                      <i className="far fa-trash-alt" />
                    </span>
                    <span>Delete My Bid</span>
                  </button>
                </footer>
              </div>
            </div>,
            document.querySelector('#bidorboo-root-modals'),
          )}
        <div style={{ height: 'auto ' }} className="card">
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
                  <div className="dropdown-menu" id="dropdown-menu" role="menu">
                    <div className="dropdown-content">
                      <a
                        onClick={() => {
                          this.toggleDeleteConfirmationDialog();
                        }}
                        className="dropdown-item has-text-danger"
                      >
                        <span className="icon">
                          <i className="far fa-trash-alt" aria-hidden="true" />
                        </span>
                        <span>Delete Bid</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <hr className="divider isTight" />
              <div className="field">
                <label className="label">Requester:</label>
                <UserImageAndRating userDetails={_ownerRef} />
              </div>
              {isAwardedToSomeoneElse && (
                <div className="field">
                  <label className="label">Bid Status</label>
                  <div className="control">Awarded to someone else</div>
                  <div className="help">
                    * but don't worry If The chosen tasker cancels for any reason, you will get
                    another chance
                  </div>
                </div>
              )}

              {!isAwardedToSomeoneElse && (
                <React.Fragment>
                  {isPastDue && (
                    <div className="field">
                      <label className="label">Bid Status</label>
                      <div className="control has-text-danger">Past Due - Expired</div>
                      <div className="help has-text-danger">
                        * Sorry! the requester did not select anyone and the job expired
                      </div>
                    </div>
                  )}
                  {!isPastDue && (
                    <div className="field">
                      <label className="label">Bid Status</label>
                      <div className="control has-text-info">{displayStatus}</div>
                      <div className="help">* BidOrBooCrew wishes you best of luck!</div>
                    </div>
                  )}
                </React.Fragment>
              )}
              <div className="field">
                <label className="label">My Bid</label>
                <div className="control has-text-info">{`${bidAmount}$ (${bidCurrency})`}</div>
                <div className="help">* Potential earnings if your bid wins.</div>
              </div>
              <StartDateAndTime
                date={startingDateAndTime}
                renderHelpComponent={() => (
                  <CountDownComponent startingDate={startingDateAndTime} isJobStart={false} />
                )}
              />
              <EffortLevel extras={extras} />
              <LocationLabelAndValue location={location.coordinates} />
              {showMore && (
                <React.Fragment>
                  <AvgBidDisplayLabelAndValue bidsList={_bidsListRef} />

                  <div className="field">
                    <label className="label">Detailed Description</label>

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

              <TaskerPendingBidInfo
                bid={bid}
                job={job}
                updateBidAction={updateBid}
                isAwardedToSomeoneElse={isAwardedToSomeoneElse}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
