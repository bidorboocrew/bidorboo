import React from 'react';
import ReactDOM from 'react-dom';
import TextareaAutosize from 'react-autosize-textarea';
import { Collapse } from 'react-collapse';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  taskerConfirmsRequestCompletion,
  taskerDisputesRequest,
} from '../../app-state/actions/requestActions';
import { cancelAwardedBid } from '../../app-state/actions/bidsActions';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
import {
  CountDownComponent,
  TaskSpecificExtras,
  SummaryStartDateAndTime,
  BSTaskerAwarded,
  RequestCardTitle,
  BidAmount,
  BSWaitingOnRequesterToConfirm,
  CenteredUserImageAndRating,
  TaskImagesCarousel,
  UserGivenTitle,
  TaskerWillEarn,
  AddAwardedRequestToCalendarForTasker,
} from '../../containers/commonComponents';

import TASKS_DEFINITIONS from '../tasksDefinitions';
import RequestBaseContainer from './RequestBaseContainer';

class TaskerMyAwardedBidDetails extends RequestBaseContainer {
  render() {
    const { bid, cancelAwardedBid } = this.props;

    const { _requestRef: request } = bid;

    const {
      startingDateAndTime,
      addressText,
      extras,
      detailedDescription,
      _ownerRef,
      taskerConfirmedCompletion,
      taskImages = [],
      requestTitle,
      _reviewRef,
    } = request;

    const { bidAmount, taskerPayout, _id: bidId } = bid;

    const { value: bidValue } = bidAmount;
    const { value: taskerPayoutAmount } = taskerPayout;

    const { TITLE, ID, ICON, IMG } = TASKS_DEFINITIONS[`${request.templateId}`];

    const { showDeleteDialog, showMoreOptionsContextMenu, showMore } = this.state;
    const requiresTaskerReview = _reviewRef.requiresTaskerReview;
    return (
      <React.Fragment>
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
                      the requester
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
                        <li>Your global rating will be negatively impacted</li>
                        <li>This cancellation will show up on your profile</li>
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
                      cancelAwardedBid(bid._id);
                      this.toggleDeleteConfirmationDialog();
                    }}
                    className="button is-danger"
                  >
                    <span className="icon">
                      <i className="far fa-trash-alt" />
                    </span>
                    <span>Cancel Booking</span>
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
              <RequestCardTitle
                icon={ICON}
                title={TITLE}
                img={IMG}
                meatballMenu={() =>
                  taskerConfirmedCompletion ? null : (
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
                  )
                }
              />
              <UserGivenTitle userGivenTitle={requestTitle} />

              <TaskImagesCarousel taskImages={taskImages} isLarge />
              <SummaryStartDateAndTime
                date={startingDateAndTime}
                renderHelpComponent={() => (
                  <CountDownComponent startingDate={startingDateAndTime} />
                )}
              />
              <TaskerWillEarn earningAmount={taskerPayoutAmount}></TaskerWillEarn>

              {taskerConfirmedCompletion && <BSWaitingOnRequesterToConfirm />}

              {!taskerConfirmedCompletion && <BSTaskerAwarded />}

              <Collapse isOpened={showMore}>
                <div style={{ maxWidth: 300, margin: 'auto' }} className="has-text-left">
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

        {!taskerConfirmedCompletion && (
          <ContactTheRequester
            requestTitle={requestTitle}
            otherUserProfileInfo={_ownerRef}
            renderActionButton={() => <TaskerConfirmsCompletion {...this.props} />}
            renderAddToCalendar={() => (
              <AddAwardedRequestToCalendarForTasker request={request} extraClassName={'is-small'} />
            )}
          />
        )}
        {taskerConfirmedCompletion && requiresTaskerReview && (
          <>
            <ReviewTheRequester
              otherUserProfileInfo={_ownerRef}
              renderActionButton={() => (
                <a
                  onClick={() => {
                    switchRoute(ROUTES.CLIENT.REVIEW.getTaskerRequestReview({ bidId }));
                  }}
                  className={`button  is-success`}
                >
                  <span className="icon">
                    <i className="fas fa-user-check" />
                  </span>
                  <span>Review Requester</span>
                </a>
              )}
            />
          </>
        )}
        {taskerConfirmedCompletion && !requiresTaskerReview && (
          <ReviewTheRequester
            otherUserProfileInfo={_ownerRef}
            renderActionButton={() => (
              <ul className="has-text-left">
                <li>You have submitted your review already</li>
                <li>
                  will automatically confirm it after 3 days if we don't hear back from the
                  Requester
                </li>
                <li>Your earnings will be automaticaly released after that</li>
              </ul>
            )}
          />
        )}
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    taskerConfirmsRequestCompletion: bindActionCreators(taskerConfirmsRequestCompletion, dispatch),
    taskerDisputesRequest: bindActionCreators(taskerDisputesRequest, dispatch),
    cancelAwardedBid: bindActionCreators(cancelAwardedBid, dispatch),
  };
};

export default connect(null, mapDispatchToProps)(TaskerMyAwardedBidDetails);

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
    const { taskerConfirmsRequestCompletion, request } = this.props;

    this.setState({ showConfirmationModal: false }, () => {
      taskerConfirmsRequestCompletion(request._id);
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
                  <div className="content">
                    <label className="has-text-weight-semibold">BidOrBoo is proud of you!</label>
                    <p>If you are done please confirm that you finished this request.</p>

                    <div className="group">
                      <label className="label">What will happen next?</label>
                      <ul>
                        <li>You will be prompted to review the Tasker</li>
                        <li>The Requester will be notified to confirm the task completion</li>
                        <li>
                          Once they confirm your payment will be released to your payout banking
                          account
                        </li>
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
    const { taskerDisputesRequest } = this.props;
    taskerDisputesRequest(taskerDispute);
  };
  toggleModal = () => {
    this.setState({ showConfirmationModal: !this.state.showConfirmationModal });
  };
  submitConfirmation = () => {
    const { taskerConfirmsRequestCompletion, request } = this.props;

    this.setState({ showConfirmationModal: false }, () => {
      taskerConfirmsRequestCompletion(request._id);
    });
  };
  render() {
    const { request } = this.props;
    const requestId = request._id;
    const { showConfirmationModal, selectedDispute, disputeText } = this.state;
    return (
      <React.Fragment>
        {showConfirmationModal &&
          ReactDOM.createPortal(
            <div className="modal is-active">
              <div onClick={this.toggleModal} className="modal-background" />
              <div className="modal-card">
                <header className="modal-card-head">
                  <div className="modal-card-title">File a dispute</div>
                </header>
                <section className="modal-card-body">
                  <div>
                    BidOrBoo is sorry to hear that you are not happy. We will work on resolving the
                    issue asap.
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
                  <button onClick={this.toggleModal} className="button is-outline">
                    Close
                  </button>
                  <button
                    style={{ marginLeft: 12 }}
                    type="submit"
                    onClick={() =>
                      this.submitDispute({
                        taskerDispute: {
                          reason: selectedDispute,
                          details: disputeText,
                          requestId: requestId,
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
          <span>File a dispute</span>
        </a>
      </React.Fragment>
    );
  }
}

class ContactTheRequester extends React.Component {
  render() {
    const {
      otherUserProfileInfo,
      renderAddToCalendar,
      renderActionButton,
      requestTitle,
    } = this.props;

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
            <div style={{ background: 'transparent' }} className="tabs is-centered is-medium">
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
            <p className="has-text-centered">
              Get in touch to finalize exact details like location to meet, date and time, etc
            </p>
            <div style={{ textAlign: 'center' }}>
              <CenteredUserImageAndRating userDetails={otherUserProfileInfo} large isCentered />

              <div style={{ marginBottom: '2rem' }}>
                <div className="group">
                  <div style={{ display: 'inline-block', textAlign: 'left', lineHeight: '28px' }}>
                    <div>
                      <a
                        href={`mailto:${emailAddress}?subject=BidOrBoo - Reaching out to finalize time and location details&body=Iam assigned for your ${requestTitle} request. I'm reaching out to agree on meeting time and details`}
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
            </div>
          </div>
          <div style={{ background: 'transparent' }} className="tabs is-centered is-medium">
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
          <div style={{ textAlign: 'center' }}>{renderActionButton && renderActionButton()}</div>
          <br />
        </div>
      </div>
    );
  }
}

class ReviewTheRequester extends React.Component {
  render() {
    const { otherUserProfileInfo, renderActionButton } = this.props;

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
          <div className="content has-text-left">
            <div style={{ background: 'transparent' }} className="tabs is-centered is-medium">
              <ul style={{ marginLeft: 0 }}>
                <li className="is-active">
                  <a>
                    <span className="icon">
                      <i className="far fa-handshake"></i>
                    </span>
                    <span>Review The Requester</span>
                  </a>
                </li>
              </ul>
            </div>
            <p className="has-text-centered">
              We've reached out to the requester to confirm task completion.
            </p>
            <div style={{ textAlign: 'center' }}>
              <CenteredUserImageAndRating userDetails={otherUserProfileInfo} large isCentered />

              <div style={{ textAlign: 'center' }}>
                {renderActionButton && renderActionButton()}
              </div>
            </div>
            <br />
          </div>
        </div>
      </div>
    );
  }
}
