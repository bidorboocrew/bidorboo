import React from 'react';
import ReactDOM from 'react-dom';
import TextareaAutosize from 'react-autosize-textarea';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  proposerConfirmsJobCompletion,
  cancelJobById,
  proposerDisputesJob,
} from '../../app-state/actions/jobActions';
import { showLoginDialog } from '../../app-state/actions/uiActions';

import {
  CountDownComponent,
  StartDateAndTime,
  DisplayLabelValue,
  UserImageAndRating,
  AddAwardedJobToCalendar,
  TaskSpecificExtras,
} from '../../containers/commonComponents';

import TASKS_DEFINITIONS from '../tasksDefinitions';
import RequestBaseContainer from './RequestBaseContainer';

class RequesterAwardedDetails extends RequestBaseContainer {
  constructor(props) {
    super(props);
    this.state = {
      showDisputeModal: false,
    };
  }

  closeDisputeModal = () => {
    this.setState({ showDisputeModal: false });
  };
  openDisputeModal = () => {
    this.setState({ showDisputeModal: true });
  };
  render() {
    const { job, cancelJobById } = this.props;

    if (!cancelJobById || !job) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myRequestsPage);
    }
    const {
      _id,
      startingDateAndTime,
      addressText,
      _awardedBidRef,
      extras,
      detailedDescription,
      displayStatus,
      isHappeningSoon,
      isHappeningToday,
      isPastDue,
      jobCompletion = {
        proposerConfirmed: false,
        bidderConfirmed: false,
        bidderDisputed: false,
        proposerDisputed: false,
      },
    } = job;
    if (
      !_id ||
      !startingDateAndTime ||
      !addressText ||
      !_awardedBidRef ||
      !displayStatus ||
      !extras ||
      !detailedDescription ||
      isHappeningSoon === 'undefined' ||
      isHappeningToday === 'undefined' ||
      isPastDue === 'undefined'
    ) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myRequestsPage);
    }
    const { bidAmount, _bidderRef } = _awardedBidRef;
    if (!bidAmount || !_bidderRef) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myRequestsPage);
    }

    // xxxx get currency from processed payment
    const { value: bidValue, currency: bidCurrency } = bidAmount;
    if (!bidValue || !bidCurrency) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myRequestsPage);
    }
    const { phone, email } = _bidderRef;
    if (!phone || !email) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myRequestsPage);
    }
    const { phoneNumber = 'not specified' } = phone;
    if (!phoneNumber) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myRequestsPage);
    }
    const { emailAddress } = email;
    if (!emailAddress) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myRequestsPage);
    }

    const { TITLE, ID, ICON } = TASKS_DEFINITIONS[`${job.templateId}`];
    if (!TITLE || !ID) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myRequestsPage);
    }

    const { showDeleteDialog, showMoreOptionsContextMenu, showMore, showDisputeModal } = this.state;
    const { proposerConfirmed, bidderConfirmed, bidderDisputed, proposerDisputed } = jobCompletion;
    return (
      <React.Fragment>
        <RequesterDisputes
          {...this.props}
          showDisputeModal={showDisputeModal}
          closeDisputeModal={this.closeDisputeModal}
          jobId={job._id}
        />

        {showDeleteDialog &&
          ReactDOM.createPortal(
            <div className="modal is-active">
              <div onClick={this.toggleDeleteConfirmationDialog} className="modal-background" />
              <div className="modal-card">
                <header className="modal-card-head">
                  <div className="modal-card-title">Cancel Agreement</div>
                  <button
                    onClick={this.toggleDeleteConfirmationDialog}
                    className="delete"
                    aria-label="close"
                  />
                </header>
                <section className="modal-card-body">
                  <div className="content">
                    <div>Cancelling an assigned request is considered a missed appointment.</div>
                    <br />
                    <div>
                      We understand that life "happens" , but to keep things fair for you and the
                      tasker we encourage you to reach out and try to reschedule this task to avoid
                      cancellation
                    </div>
                    <hr className="divider" />

                    <div className="group saidTest">
                      <label className="label">What you need to know:</label>
                      <div className="control">
                        * You will be <strong>penalized 20%</strong> of the total payment and will
                        be refunded 80%.
                      </div>
                      <div className="control">* Your global rating will be impacted</div>
                      <div className="control">
                        * Cancelling often will put a ban on your account
                      </div>
                    </div>
                  </div>
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
                      cancelJobById(job._id);
                      this.toggleDeleteConfirmationDialog();
                    }}
                    className="button is-danger"
                  >
                    <span className="icon">
                      <i className="far fa-trash-alt" />
                    </span>
                    <span>Cancel Agreement</span>
                  </button>
                </footer>
              </div>
            </div>,
            document.querySelector('#bidorboo-root-modals'),
          )}

        <div style={{ height: 'auto' }} className="card">
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
              {bidderConfirmed && (
                <div className="group saidTest">
                  <label className="label">Request Status</label>
                  <div className="control has-text-success">Pending Confirmation</div>

                  <div className="help">
                    * The Tasker is Done thier work, Please confirm completion asap
                  </div>
                </div>
              )}
              {!bidderConfirmed && (
                <div className="group saidTest">
                  <label className="label">Request Status</label>
                  <div className="control has-text-success">{displayStatus}</div>
                  {!isHappeningSoon && !isHappeningToday && !isPastDue && (
                    <div className="help">
                      * Get In touch with the tasker to confirm any further details
                    </div>
                  )}
                  {isHappeningSoon && !isHappeningToday && !isPastDue && (
                    <div className="help">* Happening soon, Make sure to contact the Tasker</div>
                  )}
                  {isHappeningToday && !isPastDue && (
                    <div className="help">* Happening today, Tasker will show up on time</div>
                  )}
                  {isPastDue && (
                    <div className="help">
                      * This request date is past Due, plz confirm completion
                    </div>
                  )}
                </div>
              )}
              <div className="group saidTest">
                <label className="label">Task Cost</label>
                <div className="control has-text-success">{`${bidValue -
                  Math.ceil(bidValue * 0.04)}$ (${bidCurrency})`}</div>
                <div className="help">* will be charged after the request is completed.</div>
              </div>
              <StartDateAndTime
                date={startingDateAndTime}
                renderHelpComponent={() => (
                  <CountDownComponent startingDate={startingDateAndTime} isJobStart={false} />
                )}
              />
              {showMore && (
                <React.Fragment>
                  <DisplayLabelValue labelText="Address" labelValue={addressText} />
                  <TaskSpecificExtras templateId={ID} extras={extras} />
                  <div className="group saidTest">
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
                  <a onClick={this.toggleShowMore} className="button is-small">
                    <span style={{ marginRight: 4 }}>show full details</span>
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
            </div>
          </div>
        </div>
        <br />
        <div style={{ height: 'auto' }} className="card cardWithButton nofixedwidth">
          <div className="card-content">
            <div className="content">
              <div style={{ display: 'flex' }}>
                <div style={{ flexGrow: 1 }} className="title">
                  <span className="icon">
                    <i className={ICON} />
                  </span>
                  <span style={{ marginLeft: 7 }}>Assigned Tasker</span>
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
                  {!bidderConfirmed && !proposerConfirmed && (
                    <div className="dropdown-menu" id="dropdown-menu" role="menu">
                      <div className="dropdown-content">
                        <a onClick={this.openDisputeModal} className="dropdown-item">
                          <span className="icon">
                            <i className="far fa-frown" aria-hidden="true" />
                          </span>
                          <span>File A Dispute</span>
                        </a>
                        <hr className="dropdown-divider" />
                        <a
                          onClick={this.toggleDeleteConfirmationDialog}
                          className="dropdown-item has-text-danger"
                        >
                          <span className="icon">
                            <i className="far fa-trash-alt" aria-hidden="true" />
                          </span>
                          <span>Cancel Request</span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="group saidTest">
                <UserImageAndRating userDetails={_bidderRef} />
                <div className="field label">
                  <span className="icon">
                    <i className="far fa-envelope" />
                  </span>
                  <span>{emailAddress}</span>
                </div>
                <div className="field label">
                  <span className="icon">
                    <i className="fas fa-mobile-alt" />
                  </span>
                  <span>{phoneNumber}</span>
                </div>
                {!isPastDue && <AddAwardedJobToCalendar job={job} />}
                <div className="firstButtonInCard nofixedwidth">
                  <RequesterConfirmsCompletion {...this.props} bidderConfirmed={bidderConfirmed} />
                </div>
              </div>
            </div>
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
    userDetails: userReducer.userDetails,
    notificationFeed: uiReducer.notificationFeed,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    proposerConfirmsJobCompletion: bindActionCreators(proposerConfirmsJobCompletion, dispatch),
    cancelJobById: bindActionCreators(cancelJobById, dispatch),
    showLoginDialog: bindActionCreators(showLoginDialog, dispatch),
    proposerDisputesJob: bindActionCreators(proposerDisputesJob, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RequesterAwardedDetails);

class RequesterConfirmsCompletion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showConfirmationModal: false,
    };
  }

  toggleModal = () => {
    this.setState({ showConfirmationModal: !this.state.showConfirmationModal });
  };
  submitConfirmation = () => {
    const { proposerConfirmsJobCompletion, job } = this.props;

    this.setState({ showConfirmationModal: false }, () => {
      proposerConfirmsJobCompletion(job._id);
    });
  };
  render() {
    const { showConfirmationModal } = this.state;
    const { bidderConfirmed, job } = this.props;
    const { isPastDue } = job;

    return (
      <React.Fragment>
        {showConfirmationModal &&
          ReactDOM.createPortal(
            <div className="modal is-active">
              <div onClick={this.toggleModal} className="modal-background" />
              <div className="modal-card">
                <header className="modal-card-head">
                  <div className="modal-card-title">Tasker is Done?</div>
                </header>
                <section className="modal-card-body">
                  <p>
                    BidOrBoo crew is happy to know that our tasker fulfilled your request, and we
                    hope that it was done to your satisfaction.
                  </p>
                  <br />
                  <div className="group saidTest">
                    <label className="label">What will happen next?</label>
                    <div className="help">
                      * Once you've confirmed completion the Tasker will be paid
                    </div>
                    <div className="help">
                      * The Tasker and yourself will be prompted to Rate your experience
                    </div>
                  </div>
                </section>
                <footer className="modal-card-foot">
                  <button
                    type="submit"
                    onClick={this.submitConfirmation}
                    className="button is-success"
                  >
                    Confirm Completion
                  </button>
                  <button onClick={this.toggleModal} className="button is-outline">
                    Close
                  </button>
                </footer>
              </div>
            </div>,
            document.querySelector('#bidorboo-root-modals'),
          )}
        <a
          onClick={this.toggleModal}
          className={`button is-fullwidth is-success ${
            isPastDue || bidderConfirmed ? 'heartbeatInstant' : ''
          }`}
        >
          Confirm Task Completion
        </a>
      </React.Fragment>
    );
  }
}

class RequesterDisputes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disputeText: '',
      selectedDispute: '',
    };
  }

  submitDispute = (taskerDispute) => {
    const { proposerDisputesJob } = this.props;
    proposerDisputesJob(taskerDispute);
  };

  render() {
    const { jobId, showDisputeModal, closeDisputeModal } = this.props;

    const { selectedDispute, disputeText } = this.state;
    return (
      <React.Fragment>
        {showDisputeModal &&
          ReactDOM.createPortal(
            <div className="modal is-active">
              <div onClick={closeDisputeModal} className="modal-background" />
              <div className="modal-card">
                <header className="modal-card-head">
                  <div className="modal-card-title">File A Dispute</div>
                </header>
                <section className="modal-card-body">
                  <div>
                    BidOrBooCrew is sorry to hear that you are not happy. We will work on resolving
                    the issue asap.
                  </div>

                  <br />
                  <div className="group saidTest">
                    <label className="label">What is your dispute?</label>
                  </div>

                  <div className="group saidTest">
                    <label className="radio">
                      <input
                        type="radio"
                        name="Tasker Did Not Show Up"
                        onChange={() =>
                          this.setState({ selectedDispute: 'Tasker Did Not Show Up' })
                        }
                        checked={selectedDispute === 'Tasker Did Not Show Up'}
                      />
                      {` Tasker did not show up`}
                    </label>
                  </div>
                  <div className="group saidTest">
                    <label className="radio">
                      <input
                        type="radio"
                        name="Tasker Did Not Do A Good Job"
                        onChange={() =>
                          this.setState({ selectedDispute: 'Tasker Did Not Do A Good Job' })
                        }
                        checked={selectedDispute === 'Tasker Did Not Do A Good Job'}
                      />
                      {` Tasker did not do a good job`}
                    </label>
                  </div>
                  <div className="group saidTest">
                    <label className="radio">
                      <input
                        type="radio"
                        name="Misconduct"
                        onChange={() => this.setState({ selectedDispute: 'Misconduct' })}
                        checked={selectedDispute === 'Misconduct'}
                      />
                      {` Misconduct such as; bullying, threatning or sexual harrasment`}
                    </label>
                  </div>
                  <div className="group saidTest">
                    <label className="radio">
                      <input
                        type="radio"
                        name="Other Dispute"
                        onChange={() => this.setState({ selectedDispute: 'Other Dispute' })}
                        checked={selectedDispute === 'Other Dispute'}
                      />
                      {` Other`}
                    </label>
                  </div>

                  <div className="group saidTest">
                    <label className="label">Tell us some more details</label>
                    <textarea
                      className="textarea"
                      placeholder="Tell us a little more about your disppute..."
                      rows="3"
                      value={disputeText}
                      onChange={(e) => {
                        if (disputeText.length < 300) {
                          this.setState({ disputeText: e.target.value });
                        }
                      }}
                    />
                  </div>
                  <div className="help">
                    * BidOrBoo Support will confirm all these details and will get in touch with the
                    Tasker to resolve this issue
                  </div>
                </section>
                <footer className="modal-card-foot">
                  <button onClick={closeDisputeModal} className="button is-outline">
                    Close
                  </button>
                  <button
                    type="submit"
                    onClick={() =>
                      this.submitDispute({
                        proposerDispute: {
                          reason: selectedDispute,
                          details: disputeText,
                          jobId: jobId,
                        },
                      })
                    }
                    className="button is-danger"
                  >
                    File My Dispute
                  </button>
                </footer>
              </div>
            </div>,
            document.querySelector('#bidorboo-root-modals'),
          )}
      </React.Fragment>
    );
  }
}
