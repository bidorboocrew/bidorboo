import React from 'react';
import ReactDOM from 'react-dom';
import TextareaAutosize from 'react-autosize-textarea';
import { Collapse } from 'react-collapse';

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
  DisplayLabelValue,
  TaskCost,
  AddAwardedJobToCalendarForRequester,
  TaskSpecificExtras,
  JobCardTitle,
  SummaryStartDateAndTime,
  CenteredUserImageAndRating,
  AssignedTasker,
  TaskImagesCarousel,
} from '../../containers/commonComponents';

import TASKS_DEFINITIONS from '../tasksDefinitions';
import RequestBaseContainer from './RequestBaseContainer';

class RequesterAwardedDetails extends RequestBaseContainer {
  constructor(props) {
    super(props);
    this.state = {
      showDisputeModal: false,
      showMore: false,
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
      taskImages = [],
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

    const { TITLE, ID, ICON, IMG } = TASKS_DEFINITIONS[`${job.templateId}`];
    if (!TITLE || !ID) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myRequestsPage);
    }

    const { showDeleteDialog, showMoreOptionsContextMenu, showMore, showDisputeModal } = this.state;
    const { proposerConfirmed, bidderConfirmed } = jobCompletion;
    const jobId = _id;
    return (
      <React.Fragment>
        <RequesterDisputes
          {...this.props}
          showDisputeModal={showDisputeModal}
          closeDisputeModal={this.closeDisputeModal}
          jobId={jobId}
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
                    <div className="has-text-danger">
                      Cancelling an assigned request is considered a missed appointment.
                    </div>
                    <br />
                    <div>
                      We understand that life happens, but to keep things fair for you and the
                      tasker we encourage you to reach out and try to reschedule this task to avoid
                      cancellation
                    </div>
                    <br />

                    <div className="group">
                      <label className="label">What you need to know:</label>
                      <div className="control">
                        * You will recieve a refund of
                        <span className="has-text-danger has-text-weight-semibold">
                          {` 80% of your original payment `}
                        </span>
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
        <div
          style={{
            boxShadow: 'none',
            borderLeft: '1px solid rgba(10,10,10,0.2)',
            borderTop: '1px solid rgba(10,10,10,0.2)',
            borderRight: '1px solid rgba(10,10,10,0.2)',
          }}
          className="card has-text-centered"
        >
          <div style={{ borderBottom: 0 }} className="card-content">
            <div className="content">
              <JobCardTitle
                icon={ICON}
                title={TITLE}
                img={IMG}
                meatballMenu={() => (
                  <div
                    ref={(node) => (this.node = node)}
                    className={`dropdown is-right is-pulled-right ${
                      showMoreOptionsContextMenu ? 'is-active' : ''
                    }`}
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
                )}
              />
              <TaskImagesCarousel taskImages={taskImages} isLarge />
              <SummaryStartDateAndTime
                date={startingDateAndTime}
                renderHelpComponent={() => (
                  <CountDownComponent startingDate={startingDateAndTime} isJobStart={false} />
                )}
              />

              <AssignedTasker displayName={_awardedBidRef._bidderRef.displayName} />

              <Collapse isOpened={showMore}>
                <div className="has-text-left">
                  <TaskCost cost={bidValue} />
                  <DisplayLabelValue labelText="Address" labelValue={addressText} />

                  <TaskSpecificExtras templateId={ID} extras={extras} />
                  <div className="group">
                    <label className="label hasSelectedValue">Detailed Description</label>
                    <TextareaAutosize
                      value={detailedDescription}
                      className="textarea is-marginless is-paddingless control"
                      style={{
                        resize: 'none',
                        border: 'none',
                      }}
                      readOnly
                    />
                  </div>
                </div>
              </Collapse>
              <div>
                {!showMore && (
                  <a onClick={this.toggleShowMore} className="button is-small">
                    <span style={{ marginRight: 4 }}>show more details</span>
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

        <AssignedTaskerDetails
          otherUserProfileInfo={_bidderRef}
          emailAddress={emailAddress}
          phoneNumber={phoneNumber}
          renderAddToCalendar={() => {
            return (
              !isPastDue && (
                <AddAwardedJobToCalendarForRequester job={job} extraClassName={'is-small'} />
              )
            );
          }}
          renderActionButton={() => (
            <>
              <RequesterConfirmsCompletion {...this.props} bidderConfirmed={bidderConfirmed} />
              <br></br>
              <br></br>
            </>
          )}
        />
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
                  <div className="group">
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
                    Confirm Task Task Completion
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
          className="button is-success"
          // className={`button is-fullwidth is-success ${
          //   isPastDue || bidderConfirmed ? 'heartbeatInstant' : ''
          // }`}
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
                  <div>Don't you worry , BidOrBooCrew will work on resolving this ASAP</div>

                  <br />
                  <div className="group">
                    <label className="label">What is your dispute?</label>
                  </div>

                  <div>
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
                  <div>
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
                  <div>
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
                  <div className="group">
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
                  <div className="group">
                    <label className="label">Tell us some more details</label>
                    <textarea
                      className="textarea"
                      style={{ resize: 'none' }}
                      placeholder="Enter more details about your disppute..."
                      rows="3"
                      value={disputeText}
                      onChange={(e) => {
                        if (disputeText.length < 300) {
                          this.setState({ disputeText: e.target.value });
                        }
                      }}
                    />
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

class AssignedTaskerDetails extends React.Component {
  render() {
    const {
      otherUserProfileInfo,
      emailAddress,
      phoneNumber,
      renderActionButton,

      renderAddToCalendar,
    } = this.props;

    if (!otherUserProfileInfo) {
      return null;
    }

    return (
      <div
        style={{
          boxShadow: 'none',
          borderLeft: '1px solid rgba(10,10,10,0.2)',
          borderBottom: '1px solid rgba(10,10,10,0.2)',
          borderRight: '1px solid rgba(10,10,10,0.2)',
        }}
        className="card cardWithButton nofixedwidth"
      >
        <div style={{ paddingTop: 0 }} className="card-content">
          <div className="content">
            <div style={{ background: 'transparent' }} className="tabs is-centered">
              <ul style={{ marginLeft: 0 }}>
                <li className="is-active">
                  <a>
                    <span className="icon">
                      <i className="far fa-handshake"></i>
                    </span>
                    <span>Contact The Assigned Tasker</span>
                  </a>
                </li>
              </ul>
            </div>

            <p>Get in touch to finalize exact details like location to meet, date and time, etc</p>

            <CenteredUserImageAndRating
              userDetails={otherUserProfileInfo}
              large
              isCentered={false}
            />

            <div style={{ marginBottom: '2rem' }}>
              <div className="group">
                <div style={{ fontWeight: 500, fontSize: 16 }}>
                  <div>
                    <a
                      href={`mailto:${emailAddress}?subject=BidOrBoo - I requested your service and reaching out to agree on meeting time and details`}
                    >
                      <span className="icon">
                        <i className="far fa-envelope" />
                      </span>
                      <span>{emailAddress}</span>
                    </a>
                  </div>
                  <div>
                    <a
                      href={`sms://${phoneNumber}?body=Hello%20I%20assigned%20you%20a%20task%20from%20BidOrBoo%20and%20am%20reaching%20out%20to%20agree%20on%20meeting%20time%20and%20details`}
                    >
                      <span className="icon">
                        <i className="fas fa-sms" />
                      </span>
                      <span>{phoneNumber}</span>
                    </a>
                  </div>
                  <div>
                    <a href={`tel:${phoneNumber}`}>
                      <span className="icon">
                        <i className="fas fa-mobile-alt" />
                      </span>
                      <span>{phoneNumber}</span>
                    </a>
                  </div>
                </div>
              </div>
              {renderAddToCalendar && renderAddToCalendar()}
              <br />
            </div>
            <div style={{ background: 'transparent' }} className="tabs is-centered">
              <ul style={{ marginLeft: 0 }}>
                <li className="is-active">
                  <a>
                    <span className="icon is-small">
                      <i className="fa fa-clock" aria-hidden="true" />
                    </span>
                    <span>After The Task Is fulfilled</span>
                  </a>
                </li>
              </ul>
            </div>
            {renderActionButton && renderActionButton()}
          </div>
        </div>
      </div>
    );
  }
}
