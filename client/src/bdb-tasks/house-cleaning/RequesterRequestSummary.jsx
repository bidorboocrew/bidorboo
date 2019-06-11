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
  DisplayShortAddress,
} from '../../containers/commonComponents';

import TASKS_DEFINITIONS from './tasksDefinitions';
import { isPast } from 'date-fns';

class RequesterRequestSummary extends React.Component {
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
    const { job, cancelJobById, notificationFeed } = this.props;
    if (!job || !job._id || !notificationFeed || !cancelJobById) {
      return <div>RequesterRequestSummary is missing properties</div>;
    }

    const {
      _id: jobId,
      startingDateAndTime,
      addressText,
      isHappeningSoon,
      isHappeningToday,
      isPastDue,
    } = job;
    if (
      !jobId ||
      !startingDateAndTime ||
      !addressText ||
      isHappeningSoon === 'undefined' ||
      isHappeningToday === 'undefined' ||
      isPastDue === 'undefined'
    ) {
      return <div>RequesterRequestSummary is missing properties</div>;
    }
    const { showDeleteDialog, showMoreOptionsContextMenu } = this.state;

    const { TITLE } = TASKS_DEFINITIONS[`${job.fromTemplateId}`];
    if (!TITLE) {
      return <div>RequesterRequestSummary is missing properties</div>;
    }

    let areThereAnyBidders = job._bidsListRef && job._bidsListRef.length > 0;

    return (
      <React.Fragment>
        {showDeleteDialog &&
          ReactDOM.createPortal(
            <div className="modal is-active">
              <div onClick={this.toggleDeleteConfirmationDialog} className="modal-background" />
              <div className="modal-card">
                <header className="modal-card-head">
                  <div className="modal-card-title">Cancel Request</div>
                  <button
                    onClick={this.toggleDeleteConfirmationDialog}
                    className="delete"
                    aria-label="close"
                  />
                </header>
                <section className="modal-card-body">
                  <div className="content">
                    When you cancel a request we will delete it and all associated bids within 24
                    hours.
                    <br /> You can always post a new request at any time
                  </div>
                  <div className="help">*This action will NOT affect your ratings.</div>
                </section>
                <footer className="modal-card-foot">
                  <button
                    style={{ width: 160 }}
                    onClick={this.toggleDeleteConfirmationDialog}
                    className="button is-outline"
                  >
                    <span>Go Back</span>
                  </button>
                  <button
                    style={{ width: 160 }}
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      cancelJobById(jobId);
                      this.toggleDeleteConfirmationDialog();
                    }}
                    className="button is-danger"
                  >
                    <span className="icon">
                      <i className="far fa-trash-alt" />
                    </span>
                    <span>Cancel Request</span>
                  </button>
                </footer>
              </div>
            </div>,
            document.querySelector('#bidorboo-root-modals'),
          )}
        <div className={`card limitWidthOfCard ${isPastDue ? 'readOnlyView' : ''}`}>
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
                {!isPastDue && (
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
                          className="dropdown-item  has-text-danger"
                        >
                          <span className="icon">
                            <i className="far fa-trash-alt" aria-hidden="true" />
                          </span>
                          <span>Cancel Request</span>
                        </a>
                      </div>
                    </div>
                  </div>
                )}
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
              {isPastDue && (
                <div className="field">
                  <label className="label">Request Status</label>
                  <div className="control has-text-danger">Past Due - Expired</div>
                  <div className="help">* This Request will be deleted in 48 hours</div>
                </div>
              )}

              {!isPastDue && (
                <React.Fragment>
                  {!areThereAnyBidders && (
                    <div className="field">
                      <label className="label">Request Status</label>
                      <div className="control">Awaiting on Taskers</div>
                      {!isHappeningSoon && !isHappeningToday && (
                        <div className="help">
                          * No Taskers offered to do this yet! check again soon.
                        </div>
                      )}
                      {(isHappeningSoon || isHappeningToday) && (
                        <div className="help">* Expiring soon, if no Taskers are available yet</div>
                      )}
                    </div>
                  )}
                  {areThereAnyBidders && (
                    <div className="field">
                      <label className="label">Request Status</label>
                      <div className="control has-text-info">Taskers Available</div>
                      {!isHappeningSoon && !isHappeningToday && (
                        <div className="help has-text-info">
                          * Review the offers regularly and choose a Tasker.
                        </div>
                      )}
                      {(isHappeningSoon || isHappeningToday) && (
                        <div className="help has-text-info">
                          * Expiring soon, Choose a Tasker asap
                        </div>
                      )}
                    </div>
                  )}
                </React.Fragment>
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
          {renderFooter({ job, notificationFeed, isPastDue })}
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
)(RequesterRequestSummary);

const renderFooter = ({ job, notificationFeed, isPastDue }) => {
  let areThereAnyBidders = job._bidsListRef && job._bidsListRef.length > 0;
  let doesthisJobHaveNewBids = false;
  // let numberOfNewBids = 0;

  if (!isPastDue && notificationFeed.jobIdsWithNewBids) {
    for (let i = 0; i < notificationFeed.jobIdsWithNewBids.length; i++) {
      if (notificationFeed.jobIdsWithNewBids[i]._id === job._id) {
        doesthisJobHaveNewBids = true;
        // numberOfNewBids = notificationFeed.jobIdsWithNewBids[i]._bidsListRef.length;
        break;
      }
    }
  }

  return (
    <React.Fragment>
      <div style={{ padding: '0.5rem' }}>
        <hr className="divider isTight" />
      </div>

      {isPastDue && (
        <div style={{ padding: '0 0.5rem 0.5rem 0.5rem' }}>
          <a
            disabled={isPastDue}
            style={{ position: 'relative' }}
            className={`button is-outlined is-fullwidth is-danger`}
          >
            <span className="icon">
              <i className="far fa-trash-alt" />
            </span>
            <span>Will be auto deleted</span>
          </a>
        </div>
      )}
      {!isPastDue && (
        <div style={{ padding: '0 0.5rem 0.5rem 0.5rem' }}>
          <a
            disabled={isPastDue}
            style={{ position: 'relative' }}
            onClick={() => {
              switchRoute(ROUTES.CLIENT.PROPOSER.dynamicReviewRequestAndBidsPage(job._id));
            }}
            className={`button is-outlined is-fullwidth ${areThereAnyBidders ? 'is-info' : ''}`}
          >
            {areThereAnyBidders && !isPastDue && (
              <span>
                <span className="icon">
                  <i className="fa fa-hand-paper" />
                </span>
                <span>{`View (${job._bidsListRef.length}) ${
                  job._bidsListRef.length > 1 ? 'Offers' : 'Offer'
                }`}</span>
              </span>
            )}
            {!areThereAnyBidders && <span>View Details</span>}
            {areThereAnyBidders && doesthisJobHaveNewBids && (
              <div
                style={{ position: 'absolute', top: -5, right: -5, fontSize: 10 }}
                className="has-text-danger"
              >
                <i className="fas fa-circle" />
              </div>
            )}
          </a>
        </div>
      )}
    </React.Fragment>
  );
};
