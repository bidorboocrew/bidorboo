import React from 'react';
import ReactDOM from 'react-dom';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';
import {
  CountDownComponent,
  StartDateAndTime,
  DisplayShortAddress,
  UserImageAndRating,
} from '../../containers/commonComponents';

import { HOUSE_CLEANING_DEF } from './houseCleaningDefinition';

export default class HouseCleaningAwardedRequestSummary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showDeleteDialog: false,
      showMoreOptionsContextMenu: false,
    };
  }

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
    const { job, deleteJob, notificationFeed } = this.props;

    const { startingDateAndTime, addressText, _awardedBidRef, jobCompletion } = job;

    const { bidAmount, _bidderRef } = _awardedBidRef;
    const { phone, email } = _bidderRef;

    const { showDeleteDialog, showMoreOptionsContextMenu } = this.state;

    const { TITLE, IMG_URL } = HOUSE_CLEANING_DEF;
    const didProposerConfirmCompletionAlready = jobCompletion.proposerConfirmed;

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
                        * You will be <strong>penalized 50%</strong> of the total payment.
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
                      deleteJob(job._id);
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

                {!didProposerConfirmCompletionAlready && (
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
                          className="dropdown-item has-text-danger"
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

              <div className="field">
                <label className="label">Request Status</label>
                {didProposerConfirmCompletionAlready ? (
                  <div className="control has-text-primary">Waiting for Your Review</div>
                ) : (
                  <React.Fragment>
                    <div className="control has-text-success">Tasker is Assigned</div>
                    <div className="help">
                      * The tasker will do this request on the specified date.
                    </div>
                  </React.Fragment>
                )}
              </div>
              <div className="field">
                <label className="label">Total Cost</label>
                <div
                  className={`control ${
                    didProposerConfirmCompletionAlready ? '' : 'has-text-success'
                  } `}
                >
                  {bidAmount && ` ${bidAmount.value}$ (${bidAmount.currency})`}
                </div>
                {!didProposerConfirmCompletionAlready && (
                  <div className="help">* will be charged after the request is completed.</div>
                )}
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
                {!didProposerConfirmCompletionAlready && (
                  <React.Fragment>
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
                  </React.Fragment>
                )}
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
              className={`button is-outlined ${
                didProposerConfirmCompletionAlready ? 'is-primary' : ''
              }`}
              style={{ flexGrow: 1, marginRight: 10 }}
            >
              {didProposerConfirmCompletionAlready ? 'Review Tasker' : 'View Details'}
            </a>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
