import React from 'react';
import ReactDOM from 'react-dom';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { proposerConfirmsJobCompletion, cancelJobById } from '../../app-state/actions/jobActions';
import { showLoginDialog } from '../../app-state/actions/uiActions';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';
import {
  CountDownComponent,
  StartDateAndTime,
  LocationLabelAndValue,
} from '../../containers/commonComponents';

import TASKS_DEFINITIONS from '../tasksDefinitions';
import { REQUEST_STATES } from '../index';

class TaskerMyOpenBidSummary extends React.Component {
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
    if (!bid || !job || !otherArgs) {
      return <div>TaskerMyOpenBidSummary is missing properties</div>;
    }

    const { deleteOpenBid } = otherArgs;
    if (!deleteOpenBid) {
      return <div>TaskerMyOpenBidSummary is missing properties</div>;
    }

    const { startingDateAndTime, location, isPastDue, state } = job;
    if (!startingDateAndTime || !location || isPastDue === 'undefined') {
      return <div>TaskerMyOpenBidSummary is missing properties</div>;
    }
    const { coordinates } = location;
    if (!coordinates) {
      return <div>TaskerMyOpenBidSummary is missing properties</div>;
    }
    const { bidAmount } = bid;
    if (!bidAmount) {
      return <div>TaskerMyOpenBidSummary is missing properties</div>;
    }
    const { value: bidValue, currency: bidCurrency } = bidAmount;
    if (!bidValue || !bidCurrency) {
      return <div>TaskerMyOpenBidSummary is missing properties</div>;
    }

    const { displayStatus } = bid;
    if (!displayStatus) {
      return <div>TaskerMyOpenBidSummary is missing properties</div>;
    }

    const { TITLE, ICON } = TASKS_DEFINITIONS[`${job.templateId}`];
    if (!TITLE) {
      return <div>TaskerMyOpenBidSummary is missing properties</div>;
    }

    const { showDeleteDialog, showMoreOptionsContextMenu } = this.state;

    const isAwardedToSomeoneElse = state === REQUEST_STATES.AWARDED;
    const requesterCanceledThierRequest = state === REQUEST_STATES.CANCELED_OPEN;

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
        <div
          className={`card limitWidthOfCard ${
            isPastDue || requesterCanceledThierRequest ? 'readOnlyView' : ''
          }`}
        >
          <div className="card-content">
            <div className="content">
              <div style={{ display: 'flex' }}>
                <div style={{ flexGrow: 1 }} className="is-size-4 has-text-weight-bold">
                  <span className="icon">
                    <i className={ICON} />
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
                          <i className="far fa-trash-alt has-text-danger" aria-hidden="true" />
                        </span>
                        <span>Delete Bid</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <hr className="divider isTight" />
              {isAwardedToSomeoneElse && (
                <div className="group saidTest">
                  <label className="label">Bid Status</label>
                  <div className="control has-text-info">Awarded to someone else</div>
                  <div className="help">
                    * but don't worry If The chosen tasker cancels for any reason, you will get
                    another chance
                  </div>
                </div>
              )}
              {requesterCanceledThierRequest && (
                <div className="group saidTest">
                  <label className="label">Bid Status</label>
                  <div className="control has-text-info">Requester canceled this request</div>
                  <div className="help">
                    * This request is no longer active, the request and your bid will be deleted in
                    48hours
                  </div>
                </div>
              )}
              {!isAwardedToSomeoneElse && !requesterCanceledThierRequest && (
                <React.Fragment>
                  {isPastDue && (
                    <div className="group saidTest">
                      <label className="label">Bid Status</label>
                      <div className="control has-text-dark">Past Due - Expired</div>
                      <div className="help">* Sorry! the requester did not select anyone</div>
                    </div>
                  )}
                  {!isPastDue && (
                    <div className="group saidTest">
                      <label className="label">Bid Status</label>
                      <div className="control has-text-info">{displayStatus}</div>
                      <div className="help">* BidOrBooCrew wishes you best of luck!</div>
                    </div>
                  )}
                </React.Fragment>
              )}
              <div className="group saidTest">
                <label className="label">Potential Payout</label>
                <div className="control has-text-info">{`${bidValue -
                  Math.ceil(bidValue * 0.04)}$ (${bidCurrency})`}</div>
                <div className="help">* Potential earnings if your bid wins.</div>
              </div>
              <StartDateAndTime
                date={startingDateAndTime}
                renderHelpComponent={() => (
                  <CountDownComponent startingDate={startingDateAndTime} isJobStart={false} />
                )}
              />

              {/* <LocationLabelAndValue location={coordinates} useShortAddress /> */}
            </div>
          </div>
          {renderFooter({ bid, isPastDue, isAwardedToSomeoneElse, requesterCanceledThierRequest })}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ jobsReducer, userReducer, uiReducer }) => {
  return {
    isLoggedIn: userReducer.isLoggedIn,
    selectedAwardedJob: jobsReducer.selectedAwardedJob,
    userDetails: userReducer.userDetails,
    notificationFeed: uiReducer.notificationFeed,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    proposerConfirmsJobCompletion: bindActionCreators(proposerConfirmsJobCompletion, dispatch),
    cancelJobById: bindActionCreators(cancelJobById, dispatch),
    showLoginDialog: bindActionCreators(showLoginDialog, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TaskerMyOpenBidSummary);

const renderFooter = ({
  bid,
  isPastDue,
  isAwardedToSomeoneElse,
  requesterCanceledThierRequest,
}) => {
  return (
    <React.Fragment>
      <div style={{ padding: '0.5rem' }}>
        <hr className="divider isTight" />
      </div>
      <div style={{ padding: '0 0.5rem 0.5rem 0.5rem' }}>
        <a
          style={{ position: 'relative' }}
          onClick={() => {
            switchRoute(ROUTES.CLIENT.BIDDER.dynamicReviewMyOpenBidAndTheRequestDetails(bid._id));
          }}
          className={`button is-fullwidth ${isPastDue ? '' : 'is-info'}`}
        >
          {!isPastDue && !isAwardedToSomeoneElse && !requesterCanceledThierRequest && (
            <span>Change My Bid</span>
          )}
          {isPastDue && !isAwardedToSomeoneElse && !requesterCanceledThierRequest && (
            <span>View Expired Task</span>
          )}
          {requesterCanceledThierRequest && <span>View Canceled Task</span>}
          {isAwardedToSomeoneElse && <span>View Task Details</span>}
        </a>
      </div>
    </React.Fragment>
  );
};
