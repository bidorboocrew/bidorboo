import React from 'react';
import ReactDOM from 'react-dom';
import TextareaAutosize from 'react-autosize-textarea';
import { Collapse } from 'react-collapse';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  proposerConfirmsJobCompletion,
  cancelJobById,
  proposerDisputesJob,
} from '../../app-state/actions/jobActions';

import {
  CountDownComponent,
  DisplayLabelValue,
  TaskCost,
  AddAwardedJobToCalendarForTasker,
  TaskSpecificExtras,
  JobCardTitle,
  SummaryStartDateAndTime,
  CenteredUserImageAndRating,
  AssignedTasker,
  TaskImagesCarousel,
  UserGivenTitle,
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

    const {
      _id: jobId,
      startingDateAndTime,
      addressText,
      _awardedBidRef,
      extras,
      detailedDescription,
      taskerConfirmedCompletion,
      taskImages = [],
      jobTitle,
    } = job;

    const { requesterPayment, requesterPartialRefund, _taskerRef } = _awardedBidRef;

    const { value: requesterPartialRefundAmount } = requesterPartialRefund;
    const { value: requesterPaymentAmount } = requesterPayment;

    const { phone, email } = _taskerRef;
    const { phoneNumber } = phone;
    const { emailAddress } = email;

    const { TITLE, ID, ICON, IMG } = TASKS_DEFINITIONS[`${job.templateId}`];

    const { showDeleteDialog, showMoreOptionsContextMenu, showMore, showDisputeModal } = this.state;

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
                  <div className="modal-card-title">Cancel Booking?</div>
                  <button
                    onClick={this.toggleDeleteConfirmationDialog}
                    className="delete"
                    aria-label="close"
                  />
                </header>
                <section className="modal-card-body">
                  <div className="content">
                    <div className="has-text-danger">
                      Cancelling your booking is taken seriously as it will cause inconvenience for
                      the Tasker
                    </div>
                    <br />
                    <div>
                      We understand that life happens, but to keep things fair we encourage you to
                      reach out and try to reschedule this task to avoid cancellation
                    </div>
                    <br />
                    <div className="group">
                      <label className="label has-text-danger">
                        Before you proceed you must know:
                      </label>
                      <ul>
                        <li>
                          {'You will receive a refund of '}
                          <span className="has-text-weight-semibold">
                            {` $${requesterPartialRefundAmount} `}
                          </span>
                          {'which is ~ 90% of your original payment'}
                        </li>
                        <li>Your global rating will be negatively impacted</li>
                        <li>This cancellation will show up on your profile</li>{' '}
                        <li>Cancelling often will put a ban on your account</li>
                      </ul>
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
                    <span>Cancel This Booking</span>
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
                    {!taskerConfirmedCompletion && (
                      <div className="dropdown-menu" id="dropdown-menu" role="menu">
                        <div className="dropdown-content">
                          <a onClick={this.openDisputeModal} className="dropdown-item">
                            <span className="icon">
                              <i className="far fa-frown" aria-hidden="true" />
                            </span>
                            <span>File a dispute</span>
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
              <UserGivenTitle userGivenTitle={jobTitle} />

              <TaskImagesCarousel taskImages={taskImages} isLarge />
              <SummaryStartDateAndTime
                date={startingDateAndTime}
                renderHelpComponent={() => (
                  <CountDownComponent startingDate={startingDateAndTime} />
                )}
              />

              <AssignedTasker displayName={_awardedBidRef._taskerRef.displayName} />
              <TaskCost
                cost={requesterPaymentAmount}
                renderHelp={() => (
                  <div className="help">to be paid to Tasker after task completion</div>
                )}
              />

              <Collapse isOpened={showMore}>
                <div style={{ maxWidth: 300, margin: 'auto' }} className="has-text-left">
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
          otherUserProfileInfo={_taskerRef}
          emailAddress={emailAddress}
          phoneNumber={phoneNumber}
          renderAddToCalendar={() => (
            <AddAwardedJobToCalendarForTasker job={job} extraClassName={'is-small'} />
          )}
          renderActionButton={() => (
            <>
              <RequesterConfirmsCompletion {...this.props} />
              <br></br>
              <br></br>
            </>
          )}
        />
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    proposerConfirmsJobCompletion: bindActionCreators(proposerConfirmsJobCompletion, dispatch),
    cancelJobById: bindActionCreators(cancelJobById, dispatch),
    proposerDisputesJob: bindActionCreators(proposerDisputesJob, dispatch),
  };
};

export default connect(null, mapDispatchToProps)(RequesterAwardedDetails);

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
    const { job } = this.props;

    return (
      <React.Fragment>
        {showConfirmationModal &&
          ReactDOM.createPortal(
            <div className="modal is-active">
              <div onClick={this.toggleModal} className="modal-background" />
              <div className="modal-card">
                <header className="modal-card-head">
                  <div className="modal-card-title">Is the Task Done?</div>
                </header>
                <section className="modal-card-body">
                  <div className="content">
                    <p className="has-text-success">
                      BidOrBoo is happy to know that our Tasker fulfilled your request.
                    </p>
                    <br />
                    <div className="group">
                      <label className="label">What will happen next?</label>
                      <ul>
                        <li>Once you've confirmed completion the Tasker will be paid</li>
                        <li>You will be prompted to review the Tasker</li>
                      </ul>
                    </div>
                  </div>
                </section>
                <footer className="modal-card-foot">
                  <button onClick={this.toggleModal} className="button is-outline">
                    Close
                  </button>
                  <button
                    type="submit"
                    onClick={this.submitConfirmation}
                    className="button is-success"
                  >
                    Confirm Task Completion
                  </button>
                </footer>
              </div>
            </div>,
            document.querySelector('#bidorboo-root-modals'),
          )}
        <a onClick={this.toggleModal} className="button is-success">
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
                  <div className="modal-card-title">File a dispute</div>
                </header>
                <section className="modal-card-body">
                  <div>Don't you worry , BidOrBoo support will work on resolving this ASAP</div>

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
                    <label className="radio has-text-dark">
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
                      placeholder="Enter more details about your dispute..."
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
                  <div className="help">
                    * Alternatively you can chat with our customer support:
                  </div>
                  <button
                    className="button is-success is-small"
                    onClick={() => {
                      if (!window.fcWidget.isOpen()) {
                        this.toggleModal();
                        window.fcWidget.open();
                      }
                    }}
                  >
                    <span className="icon">
                      <i className="far fa-comment-dots" />
                    </span>
                    <span>Chat with support</span>
                  </button>
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
                    Submit dispute
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
            <div style={{ textAlign: 'center' }}>
              <CenteredUserImageAndRating userDetails={otherUserProfileInfo} large isCentered />

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
              </div>
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
            <div style={{ textAlign: 'center' }}>{renderActionButton && renderActionButton()}</div>
          </div>
        </div>
      </div>
    );
  }
}
