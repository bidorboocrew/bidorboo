import React from 'react';
import ReactDOM from 'react-dom';
import TextareaAutosize from 'react-autosize-textarea';
import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

import TASKS_DEFINITIONS from '../tasksDefinitions';
import { REQUEST_STATES } from '../index';

import {
  CountDownComponent,
  CenteredUserImageAndRating,
  AvgBidDisplayLabelAndValue,
  LocationLabelAndValue,
  TaskSpecificExtras,
  SummaryStartDateAndTime,
  BSawaitingOnRequester,
  BSPastDueExpired,
  JobCardTitle,
  BSAwardedToSomeoneElse,
} from '../../containers/commonComponents';

import TaskerEditOrUpdateBid from '../../containers/bidder-flow/components/TaskerEditOrUpdateBid';

export default class TaskerMyOpenBidDetails extends React.Component {
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
    if (!bid || !otherArgs || !job) {
      return switchRoute(ROUTES.CLIENT.BIDDER.mybids);
    }
    const {
      startingDateAndTime,
      _bidsListRef, // not mandatory
      _ownerRef,
      detailedDescription,
      location,
      extras,
      isPastDue,
      state,
    } = job;
    if (
      !startingDateAndTime ||
      !_ownerRef ||
      !detailedDescription ||
      !location ||
      !extras ||
      !state ||
      isPastDue === 'undefined'
    ) {
      return switchRoute(ROUTES.CLIENT.BIDDER.mybids);
    }

    const { bidAmount } = bid;
    if (!bidAmount) {
      return switchRoute(ROUTES.CLIENT.BIDDER.mybids);
    }
    const { value: bidValue, currency: bidCurrency } = bidAmount;
    if (!bidValue || !bidCurrency) {
      return switchRoute(ROUTES.CLIENT.BIDDER.mybids);
    }
    const { updateBid, deleteOpenBid } = otherArgs;
    if (!updateBid || !deleteOpenBid) {
      return switchRoute(ROUTES.CLIENT.BIDDER.mybids);
    }
    const { displayStatus } = bid;
    if (!displayStatus) {
      return switchRoute(ROUTES.CLIENT.BIDDER.mybids);
    }

    const { TITLE, ID, ICON } = TASKS_DEFINITIONS[`${job.templateId}`];
    if (!TITLE || !ID) {
      return switchRoute(ROUTES.CLIENT.BIDDER.mybids);
    }

    const { showMore, showDeleteDialog, showMoreOptionsContextMenu } = this.state;

    const isAwardedToSomeoneElse = state === REQUEST_STATES.AWARDED;

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
                    <p>You can always edit your bid as long as the Requester did not award a bid</p>
                  </div>
                  <div className="help">*This action will NOT affect your ratings.</div>
                </section>
                <footer className="modal-card-foot">
                  <button
                    onClick={this.toggleDeleteConfirmationDialog}
                    className="button is-outline"
                  >
                    <span className="icon">
                      <i className="far fa-arrow-alt-circle-left" />
                    </span>
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
        <div className={`card has-text-centered cardWithButton nofixedwidth`}>
          <div className="card-content">
            <div className="content">
              <JobCardTitle
                icon={ICON}
                title={TITLE}
                meatballMenu={() => (
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
                        style={{ border: 'none', boxShadow: 'none' }}
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
                )}
              />

              <SummaryStartDateAndTime
                date={startingDateAndTime}
                renderHelpComponent={() => (
                  <CountDownComponent startingDate={startingDateAndTime} isJobStart={false} />
                )}
              />

              {isAwardedToSomeoneElse && <BSAwardedToSomeoneElse />}

              {!isAwardedToSomeoneElse && (
                <React.Fragment>
                  {isPastDue && <BSPastDueExpired />}
                  {!isPastDue && <BSawaitingOnRequester />}
                </React.Fragment>
              )}

              <div className="group">
                <label className="label">Potential Payout</label>
                <div className="control">{`${bidValue -
                  Math.ceil(bidValue * 0.04)}$ (${bidCurrency})`}</div>
              </div>

              {showMore && (
                <React.Fragment>
                  <div className="group">
                    <label className="label">Requester:</label>
                    <CenteredUserImageAndRating userDetails={_ownerRef} />
                  </div>
                  <TaskSpecificExtras templateId={ID} extras={extras} />
                  <LocationLabelAndValue location={location.coordinates} />

                  <AvgBidDisplayLabelAndValue bidsList={_bidsListRef} />

                  <div className="group">
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
                  <a onClick={this.toggleShowMore} className="button is-small">
                    <span style={{ marginRight: 4 }}>show full task details</span>
                    <span className="icon">
                      <i className="fas fa-angle-double-down" />
                    </span>
                  </a>
                )}
                {showMore && (
                  <a onClick={this.toggleShowMore} className="button is-small">
                    <span style={{ marginRight: 4 }}>show less details</span>
                    <span className="icon">
                      <i className="fas fa-angle-double-up" />
                    </span>
                  </a>
                )}
              </div>
              <br />
              <TaskerEditOrUpdateBid
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
