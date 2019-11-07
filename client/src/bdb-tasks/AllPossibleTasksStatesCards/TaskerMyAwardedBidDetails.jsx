import React from 'react';
import ReactDOM from 'react-dom';
import TextareaAutosize from 'react-autosize-textarea';
import { Collapse } from 'react-collapse';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { bidderConfirmsJobCompletion, taskerDisputesJob } from '../../app-state/actions/jobActions';
import { showLoginDialog } from '../../app-state/actions/uiActions';
import { cancelAwardedBid } from '../../app-state/actions/bidsActions';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
import {
  CountDownComponent,
  AddAwardedJobToCalendarForTasker,
  TaskSpecificExtras,
  SummaryStartDateAndTime,
  BSTaskerAwarded,
  JobCardTitle,
  BidAmount,
  BSWaitingOnRequesterToConfirm,
  CenteredUserImageAndRating,
  TaskImagesCarousel,
  UserGivenTitle,
} from '../../containers/commonComponents';

import TASKS_DEFINITIONS from '../tasksDefinitions';
import RequestBaseContainer from './RequestBaseContainer';

class TaskerMyAwardedBidDetails extends RequestBaseContainer {
  render() {
    const { bid, cancelAwardedBid } = this.props;
    if (!bid) {
      return switchRoute(ROUTES.CLIENT.BIDDER.mybids);
    }
    const { _jobRef: job } = bid;
    if (!job) {
      return switchRoute(ROUTES.CLIENT.BIDDER.mybids);
    }

    const {
      startingDateAndTime,
      addressText,
      extras,
      detailedDescription,
      displayStatus,
      isHappeningSoon,
      isHappeningToday,
      isPastDue,
      _ownerRef,
      _id: jobId,
      jobCompletion = {
        proposerConfirmed: false,
        bidderConfirmed: false,
        bidderDisputed: false,
        proposerDisputed: false,
      },
      taskImages = [],
      jobTitle,
      _reviewRef,
    } = job;
    const { requiresBidderReview } = _reviewRef;

    if (
      !startingDateAndTime ||
      !addressText ||
      !extras ||
      !detailedDescription ||
      !displayStatus ||
      !_ownerRef ||
      isHappeningSoon === 'undefined' ||
      isHappeningToday === 'undefined' ||
      isPastDue === 'undefined'
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
    const { phone, email } = _ownerRef;
    if (!phone || !email) {
      return switchRoute(ROUTES.CLIENT.BIDDER.mybids);
    }
    const { phoneNumber = 'not specified' } = phone;
    if (!phoneNumber) {
      return switchRoute(ROUTES.CLIENT.BIDDER.mybids);
    }
    const { emailAddress } = email;
    if (!emailAddress) {
      return switchRoute(ROUTES.CLIENT.BIDDER.mybids);
    }

    const { TITLE, ID, ICON, IMG } = TASKS_DEFINITIONS[`${job.templateId}`];
    if (!TITLE || !ID) {
      return switchRoute(ROUTES.CLIENT.BIDDER.mybids);
    }

    const { showDeleteDialog, showMoreOptionsContextMenu, showMore } = this.state;

    const { proposerConfirmed, bidderConfirmed, bidderDisputed, proposerDisputed } = jobCompletion;

    return (
      <React.Fragment>
        {showDeleteDialog &&
          ReactDOM.createPortal(
            <div className="modal is-active">
              <div onClick={this.toggleDeleteConfirmationDialog} className="modal-background" />
              <div className="modal-card">
                <header className="modal-card-head">
                  <div className="modal-card-title">Cancel This Agreement</div>
                  <button
                    onClick={this.toggleDeleteConfirmationDialog}
                    className="delete"
                    aria-label="close"
                  />
                </header>
                <section className="modal-card-body">
                  <div className="content">
                    <div>Cancelling on the requester is considered a Booo</div>
                    <br />
                    <div>
                      We understand that life "happens" but to keep things fair for you and the
                      tasker we encourage you to reach out and try to reschedule this task to avoid
                      cancellation
                    </div>
                    <br />
                    <div className="group">
                      <label className="label has-text-danger">
                        Before you proceed you msut know:
                      </label>
                      <ul>
                        <li>Your global rating will be negatively impacted</li>
                        <li>This cancellation will show up on your profile</li>
                        <li>If many cancellations happen in a row you will be ban from BidOrBoo</li>
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
                      cancelAwardedBid(bid._id);
                      this.toggleDeleteConfirmationDialog();
                    }}
                    className="button is-danger"
                  >
                    <span className="icon">
                      <i className="far fa-trash-alt" />
                    </span>
                    <span>Cancel Appointment</span>
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
                          <TaskerDisputes {...this.props} />

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
                  <CountDownComponent startingDate={startingDateAndTime} isJobStart={false} />
                )}
              />

              {bidderConfirmed && !proposerConfirmed && <BSWaitingOnRequesterToConfirm />}

              {!bidderConfirmed && !proposerConfirmed && <BSTaskerAwarded isPastDue={isPastDue} />}

              <Collapse isOpened={showMore}>
                <div className="has-text-left">
                  <BidAmount bidAmount={bidValue} />
                  <div className="group">
                    <label className="label hasSelectedValue">Task Address</label>
                    <div className="control">{addressText}</div>
                  </div>
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

        <RequesterDetails
          otherUserProfileInfo={_ownerRef}
          renderActionButton={() => (
            <>
              {bidderConfirmed && requiresBidderReview && (
                <a
                  onClick={() => {
                    switchRoute(ROUTES.CLIENT.REVIEW.getBidderJobReview({ jobId }));
                  }}
                  className={`button  is-success`}
                >
                  <span className="icon">
                    <i className="fas fa-user-check" />
                  </span>
                  <span>Review Requester & Task</span>
                </a>
              )}
              {bidderConfirmed && !requiresBidderReview && (
                <>
                  <p>Waiting on requester to confirm that you've completed this task</p>
                  <div className="help">We are working on getting this done asap</div>
                </>
              )}
              {!proposerConfirmed && !bidderConfirmed && (
                <TaskerConfirmsCompletion {...this.props} />
              )}
              <br></br>
              <br></br>
            </>
          )}
          renderAddToCalendar={() => {
            return (
              !isPastDue && (
                <AddAwardedJobToCalendarForTasker job={job} extraClassName={'is-small'} />
              )
            );
          }}
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
    bidderConfirmsJobCompletion: bindActionCreators(bidderConfirmsJobCompletion, dispatch),
    taskerDisputesJob: bindActionCreators(taskerDisputesJob, dispatch),
    cancelAwardedBid: bindActionCreators(cancelAwardedBid, dispatch),
    showLoginDialog: bindActionCreators(showLoginDialog, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TaskerMyAwardedBidDetails);

class TaskerConfirmsCompletion extends React.Component {
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
    const { bidderConfirmsJobCompletion, job } = this.props;

    this.setState({ showConfirmationModal: false }, () => {
      bidderConfirmsJobCompletion(job._id);
    });
  };

  render() {
    const { showConfirmationModal } = this.state;

    return (
      <React.Fragment>
        {showConfirmationModal &&
          ReactDOM.createPortal(
            <div className="modal is-active">
              <div onClick={this.toggleModal} className="modal-background" />
              <div className="modal-card">
                <header className="modal-card-head">
                  <div className="modal-card-title">Completed This Request?</div>
                </header>
                <section className="modal-card-body">
                  <p>BidOrBooCrew is proud of you!</p>
                  <br />
                  <p>If you are done please confirm that you finished this request.</p>
                  <br />

                  <div className="group">
                    <label className="label">What will happen next?</label>
                    <div className="help">
                      * The Requester will confirm that you have completed this job
                    </div>
                    <div className="help">
                      * Your payment will be released to your bank and should be available within
                      3-5 business days
                    </div>
                    <div className="help">
                      * The Requester and yourself will be prompted to Rate your experience
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

class TaskerDisputes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showConfirmationModal: false,
      disputeText: '',
      selectedDispute: '',
    };
  }
  submitDispute = (taskerDispute) => {
    const { taskerDisputesJob } = this.props;
    taskerDisputesJob(taskerDispute);
  };
  toggleModal = () => {
    this.setState({ showConfirmationModal: !this.state.showConfirmationModal });
  };
  submitConfirmation = () => {
    const { bidderConfirmsJobCompletion, job } = this.props;

    this.setState({ showConfirmationModal: false }, () => {
      bidderConfirmsJobCompletion(job._id);
    });
  };
  render() {
    const { job } = this.props;
    const jobId = job._id;
    const { showConfirmationModal, selectedDispute, disputeText } = this.state;
    return (
      <React.Fragment>
        {showConfirmationModal &&
          ReactDOM.createPortal(
            <div className="modal is-active">
              <div onClick={this.toggleModal} className="modal-background" />
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

                  <label className="label">What is your dispute?</label>

                  <div className="group">
                    <label className="radio">
                      <input
                        type="radio"
                        name="Requester was not available on the agreed on time and location"
                        onChange={() =>
                          this.setState({
                            selectedDispute:
                              'Requester was not available on the agreed on time and location',
                          })
                        }
                        checked={
                          selectedDispute ===
                          'Requester was not available on the agreed on time and location'
                        }
                      />
                      <span className="has-text-dark" style={{ paddingLeft: 4 }}>
                        Requester did not respond or show up on the agreed upon date and time
                      </span>
                    </label>
                  </div>
                  <div className="group">
                    <label className="radio">
                      <input
                        type="radio"
                        name="Requester Did not describe the work accurately"
                        onChange={() =>
                          this.setState({
                            selectedDispute: 'Requester Did not describe the work accurately',
                          })
                        }
                        checked={
                          selectedDispute === 'Requester Did not describe the work accurately'
                        }
                      />
                      <span className="has-text-dark" style={{ paddingLeft: 4 }}>
                        Requester did not describe the workload accurately
                      </span>
                    </label>
                  </div>
                  <div className="group">
                    <label className="radio">
                      <input
                        type="radio"
                        name="Misconduct"
                        onChange={() => this.setState({ selectedDispute: 'Misconduct' })}
                        checked={selectedDispute === 'Misconduct'}
                      />
                      <span className="has-text-dark" style={{ paddingLeft: 4 }}>
                        Misconduct such as; bullying, threatening or sexual harassment
                      </span>
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
                      <span className="has-text-dark" style={{ paddingLeft: 4 }}>
                        Other
                      </span>
                    </label>
                  </div>

                  <div className="group">
                    <label className="label">Tell us some more details</label>
                    <textarea
                      className="textarea"
                      placeholder="Tell us a little more about your disppute..."
                      rows="2"
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
                  <button onClick={this.toggleModal} className="button is-outline">
                    Close
                  </button>
                  <button
                    type="submit"
                    onClick={() =>
                      this.submitDispute({
                        taskerDispute: {
                          reason: selectedDispute,
                          details: disputeText,
                          jobId: jobId,
                        },
                      })
                    }
                    className="button is-danger"
                  >
                    Submit Dispute
                  </button>
                </footer>
              </div>
            </div>,
            document.querySelector('#bidorboo-root-modals'),
          )}

        <a onClick={this.toggleModal} className="dropdown-item">
          <span className="icon">
            <i className="far fa-frown" aria-hidden="true" />
          </span>
          <span>File A Dispute</span>
        </a>
      </React.Fragment>
    );
  }
}

class RequesterDetails extends React.Component {
  render() {
    const { otherUserProfileInfo, renderAddToCalendar, renderActionButton } = this.props;

    if (!otherUserProfileInfo) {
      return null;
    }

    const emailAddress = otherUserProfileInfo.email && otherUserProfileInfo.email.emailAddress;
    const phoneNumber = otherUserProfileInfo.phone && otherUserProfileInfo.phone.phoneNumber;
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
          <div className="content has-text-left">
            <div style={{ background: 'transparent' }} className="tabs is-centered">
              <ul style={{ marginLeft: 0 }}>
                <li className="is-active">
                  <a>
                    <span className="icon">
                      <i className="far fa-handshake"></i>
                    </span>
                    <span>Contact The Requester</span>
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
              <div className="field">
                <label className="has-text-grey">Contact Details</label>
                <div style={{ fontWeight: 500, fontSize: 18 }}>
                  <div>
                    <a
                      href={`mailto:${emailAddress}?subject=BidOrBoo - I am your tasker and reaching out to agree on meeting time and details`}
                    >
                      <span className="icon">
                        <i className="far fa-envelope" />
                      </span>
                      <span>{emailAddress}</span>
                    </a>
                  </div>
                  <div>
                    <a
                      href={`sms://${phoneNumber}?body=I%20am%20your%20tasker%20from%20BidOrBoo%20and%20am%20reaching%20out%20to%20agree%20on%20meeting%20time%20and%20detailsS`}
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
                  <span>After You Finish The Task</span>
                </a>
              </li>
            </ul>
          </div>
          {renderActionButton && renderActionButton()}
        </div>
      </div>
    );
  }
}
