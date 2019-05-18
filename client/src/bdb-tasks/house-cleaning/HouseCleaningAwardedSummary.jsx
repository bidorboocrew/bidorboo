import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';
import {
  CountDownComponent,
  StartDateAndTime,
  DisplayShortAddress,
  UserImageAndRating,
} from '../../containers/commonComponents';
import { proposerConfirmsJobCompletion, cancelJobById } from '../../app-state/actions/jobActions';

import { HOUSE_CLEANING_DEF } from './houseCleaningDefinition';

class HouseCleaningAwardedSummary extends React.Component {
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
    const { job, cancelJobById } = this.props;
    debugger;
    const { showDeleteDialog, showMoreOptionsContextMenu, showMore } = this.state;

    const {
      startingDateAndTime,
      addressText,
      _awardedBidRef,
      displayStatus,
      isExpiringSoon,
      isHappeningToday,
      isPastDue,
    } = job;

    const { bidAmount, _bidderRef } = _awardedBidRef;
    const { phone, email } = _bidderRef;

    const { TITLE, IMG_URL } = HOUSE_CLEANING_DEF;

    return (
      <React.Fragment>
        {showDeleteDialog &&
          ReactDOM.createPortal(
            <div className="modal is-active">
              <div onClick={this.toggleDeleteConfirmationDialog} className="modal-background" />
              <div className="modal-card">
                <header className="modal-card-head">
                  <p className="modal-card-title">Cancel Request</p>
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
                      To keep things fair for you and the tasker we encourage you to reach out and
                      try to reschedule this task to avoid cancellation
                    </div>
                    <hr className="divider" />

                    <div className="field">
                      <label className="label">What you need to know:</label>
                      <div className="control">
                        * You will be <strong>penalized 20%</strong> of the total payment and will
                        be refunded 80%.
                      </div>
                      <div className="control">* Your global rating will be impacted</div>
                    </div>
                  </div>
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
                      cancelJobById(job._id);
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

        <div className="card limitWidthOfCard">
          <div className="card-image">
            <img className="bdb-cover-img" src={IMG_URL} />
          </div>
          <div className="card-content">
            <div className="content">
              <div style={{ display: 'flex' }}>
                <div style={{ flexGrow: 1 }} className="is-size-4 has-text-weight-bold">
                  {TITLE}
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
                        href="#"
                        className="dropdown-item"
                      >
                        <span style={{ color: 'grey' }} className="icon">
                          <i className="far fa-trash-alt" aria-hidden="true" />
                        </span>
                        <span>Cancel Request</span>
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
                {isExpiringSoon && (
                  <div className="help has-text-success">
                    * Happening soon, Make sure to contact the Tasker
                  </div>
                )}
                {isHappeningToday && (
                  <div className="help has-text-success">
                    * Happening today, Tasker will show up on the scheduled time
                  </div>
                )}
                {isPastDue && (
                  <div className="help has-text-danger">
                    * This request date is past Due, view details to confirm completion
                  </div>
                )}
              </div>
              <div className="field">
                <label className="label">Total Cost</label>
                <div className="control has-text-success">
                  {bidAmount && ` ${bidAmount.value}$ (${bidAmount.currency})`}
                </div>
                <div className="help">* will be charged after the request is completed.</div>
              </div>
              <StartDateAndTime
                date={startingDateAndTime}
                renderHelpComponent={() => (
                  <CountDownComponent startingDate={startingDateAndTime} isJobStart={false} />
                )}
              />
              <DisplayShortAddress addressText={addressText} />
              <hr className="divider" />
              <div className="field">
                <label className="label">Assigned Tasker Details</label>
                <UserImageAndRating userDetails={_bidderRef} />

                <div className="control">
                  <span className="icon">
                    <i className="far fa-envelope" />
                  </span>
                  <span>{email.emailAddress}</span>
                </div>
                <div className="control">
                  <span className="icon">
                    <i className="fas fa-phone" />
                  </span>
                  <span>{phone.phoneNumber ? phone.phoneNumber : 'not provided'}</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ padding: '0.5rem' }}>
            <hr className="divider isTight" />
          </div>
          <div style={{ padding: '0 0.5rem 0.5rem 0.5rem' }}>
            <a
              onClick={() => {
                switchRoute(ROUTES.CLIENT.PROPOSER.dynamicSelectedAwardedJobPage(job._id));
              }}
              className={`button is-outlined ${isPastDue ? 'is-danger' : ''}`}
              style={{ flexGrow: 1, marginRight: 10 }}
            >
              View Details
            </a>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ jobsReducer, userReducer }) => {
  return {
    selectedAwardedJob: jobsReducer.selectedAwardedJob,
    userDetails: userReducer.userDetails,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    proposerConfirmsJobCompletion: bindActionCreators(proposerConfirmsJobCompletion, dispatch),
    cancelJobById: bindActionCreators(cancelJobById, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HouseCleaningAwardedSummary);
