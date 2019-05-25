import React from 'react';
import ReactDOM from 'react-dom';
import TextareaAutosize from 'react-autosize-textarea';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { proposerConfirmsJobCompletion } from '../../app-state/actions/jobActions';
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

class TaskerMyAwardedBidHouseCleaningDetails extends RequestBaseContainer {
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
    } = job;
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
    const { value: bidValue, currency: bidCurrency } = bidAmount;
    if (!bidValue || !bidCurrency) {
      return switchRoute(ROUTES.CLIENT.BIDDER.mybids);
    }
    const { phone, email } = _ownerRef;
    if (!phone || !email) {
      return switchRoute(ROUTES.CLIENT.BIDDER.mybids);
    }
    const { phoneNumber } = phone;
    if (!phoneNumber) {
      return switchRoute(ROUTES.CLIENT.BIDDER.mybids);
    }
    const { emailAddress } = email;
    if (!emailAddress) {
      return switchRoute(ROUTES.CLIENT.BIDDER.mybids);
    }
    const { TITLE } = HOUSE_CLEANING_DEF;
    if (!TITLE) {
      return switchRoute(ROUTES.CLIENT.BIDDER.mybids);
    }

    const { showDeleteDialog, showMoreOptionsContextMenu, showMore } = this.state;

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
                    <div>
                      Cancelling a bid after you have been assigned is considered a missed
                      appointment.
                    </div>
                    <br />
                    <div>
                      We understand that life "happens" but to keep things fair for you and the
                      tasker we encourage you to reach out and try to reschedule this task to avoid
                      cancellation
                    </div>
                    <hr className="divider" />

                    <div className="field">
                      <label className="label">What you need to know:</label>

                      <div className="control">* Your global rating will be impacted</div>
                      <div className="control">
                        * This cancellation will show up on your profile
                      </div>
                      <div className="control">
                        * If many cancellations happen in a row you will be ban from BidOrBoo
                      </div>
                    </div>
                  </div>
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
                      cancelAwardedBid(bid._id);
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
                        onClick={this.toggleDeleteConfirmationDialog}
                        className="dropdown-item has-text-danger"
                      >
                        <span className="icon">
                          <i className="far fa-trash-alt" aria-hidden="true" />
                        </span>
                        <span>Cancel Agreement</span>
                      </a>
                    </div>
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

              <div className="field">
                <label className="label">Request Status</label>
                <div className="control has-text-success">{displayStatus}</div>
                {!isHappeningSoon && !isHappeningToday && !isPastDue && (
                  <div className="help">
                    * Get In touch with the Requester to confirm any further details
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
              <div className="field">
                <label className="label">Total Cost</label>
                <div className="control has-text-success">{`${bidValue}$ (${bidCurrency})`}</div>
                <div className="help">* will be charged after the request is completed.</div>
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
                <div className="control">
                  <span className="icon">
                    <i className="far fa-envelope" />
                  </span>
                  <span>{emailAddress}</span>
                </div>
                <div className="control">
                  <span className="icon">
                    <i className="fas fa-phone" />
                  </span>
                  <span>{phoneNumber}</span>
                </div>
                {!isPastDue && <AddAwardedJobToCalendar job={job} />}
              </div>
            </div>
          </div>
          <hr className="divider isTight" />
          <div style={{ padding: '0.5rem', display: 'flex' }}>
            <TaskerConfirmsCompletion {...this.props} />
            <TaskerDisputes {...this.props} />
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
    cancelAwardedBid: bindActionCreators(cancelAwardedBid, dispatch),
    showLoginDialog: bindActionCreators(showLoginDialog, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TaskerMyAwardedBidHouseCleaningDetails);

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
    const { proposerConfirmsJobCompletion, job } = this.props;

    this.setState({ showConfirmationModal: false }, () => {
      proposerConfirmsJobCompletion(job._id);
    });
  };
  render() {
    const { showConfirmationModal } = this.state;
    const { isPastDue } = this.props.job;

    return (
      <React.Fragment>
        {showConfirmationModal &&
          ReactDOM.createPortal(
            <div className="modal is-active">
              <div onClick={this.toggleModal} className="modal-background" />
              <div className="modal-card">
                <header className="modal-card-head">
                  <div className="modal-card-title">Is The Work Completed?</div>
                </header>
                <section className="modal-card-body">
                  <p>
                    BidOrBoo crew is happy to know that our Tasker showed up to fulfill your
                    request!
                  </p>
                  <br />
                  <label className="label">After the tasker have completed the work.</label>
                  <p>Please confirm and you will be redirected to review the Tasker.</p>
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
        <div style={{ flexGrow: 1 }}>
          <a
            onClick={this.toggleModal}
            className={`button is-fullwidth is-success is-outlined ${
              isPastDue ? 'heartbeatInstant' : ''
            }`}
          >
            I am Done!
          </a>
          <div className="help">
            * click on this <strong>After</strong> You have finished doing this request
          </div>
        </div>
      </React.Fragment>
    );
  }
}

class TaskerDisputes extends React.Component {
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
                  <div>BidOrBoo takes a no show case very seriously.</div>
                  <br />
                  <div>
                    Before you file a dispute we suggest that you try to contact the Tasker on thier
                    provided email and phone.
                  </div>
                  <br />
                  <hr className="divider isTight" />
                  <div className="field">
                    <label className="label">What happens when you Dispute</label>
                    <div className="help">
                      * BidOrBoo Support will get in touch and confirm that the Tasker did not show
                      up.
                    </div>
                    <div className="help">
                      * Our Support crew will keep you updated with all the updates on this matter.
                    </div>
                    <div className="help">
                      * Upon concluding our investigation you will recieve a full refund.
                    </div>
                    <div className="help">
                      * The tasker global rating will be negatively impacted and they may get
                      banned.
                    </div>
                  </div>
                  <div>We are very sorry for the inconvienience!</div>
                </section>
                <footer className="modal-card-foot">
                  <button
                    type="submit"
                    onClick={() => alert('not implemented yet')}
                    className="button is-danger"
                  >
                    Submit Dispute
                  </button>
                  <button onClick={this.toggleModal} className="button is-outline">
                    Close
                  </button>
                </footer>
              </div>
            </div>,
            document.querySelector('#bidorboo-root-modals'),
          )}
        <div>
          <a onClick={this.toggleModal} className="button is-text">
            Or File a Dispute
          </a>
        </div>
      </React.Fragment>
    );
  }
}
