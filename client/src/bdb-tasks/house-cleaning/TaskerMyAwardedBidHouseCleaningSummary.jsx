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
  DisplayLabelValue,
  DisplayShortAddress,
} from '../../containers/commonComponents';

import { HOUSE_CLEANING_DEF } from './houseCleaningDefinition';

class TaskerMyAwardedBidHouseCleaningSummary extends React.Component {
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
    const { bid, job, cancelJobById, otherArgs } = this.props;
    const { deleteOpenBid } = otherArgs;

    const { startingDateAndTime, addressText, isPastDue } = job;

    const { showDeleteDialog, showMoreOptionsContextMenu } = this.state;

    const { TITLE } = HOUSE_CLEANING_DEF;

    const { displayStatus } = bid;

    const bidAmount = bid.bidAmount.value;
    const bidCurrency = bid.bidAmount.currency;

    return (
      <React.Fragment>
        {showDeleteDialog &&
          ReactDOM.createPortal(
            <div className="modal is-active">
              <div onClick={this.toggleDeleteConfirmationDialog} className="modal-background" />
              <div className="modal-card">
                <header className="modal-card-head">
                  <div className="modal-card-title">Cancelling your agreement?</div>
                  <button
                    onClick={this.toggleDeleteConfirmationDialog}
                    className="delete"
                    aria-label="close"
                  />
                </header>
                <section className="modal-card-body">
                  <div className="content">
                    <p>
                      Are you sure you want to Cancel your existing agreement with the requester.
                    </p>
                    <p>Have you tried contacting the Reuquester and rescheduling this job ?</p>
                    <p>
                      note: Cancelling will negatively imapact your score and possible terminate/ban
                      your account.
                    </p>
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
                      alert('cancel awarded bid');
                      // deleteOpenBid(bid._id);
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
        <div className={`card limitWidthOfCard ${isPastDue ? 'expiredReadOnly' : ''}`}>
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
                        onClick={() => {
                          this.toggleDeleteConfirmationDialog();
                        }}
                        className="dropdown-item"
                      >
                        <span style={{ color: 'grey' }} className="icon">
                          <i className="far fa-trash-alt" aria-hidden="true" />
                        </span>
                        <span>Cancel This Bid</span>
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
              {isPastDue && (
                <div className="field">
                  <label className="label">Bid Status</label>
                  <div className="control has-text-danger">Past Due - Expired</div>
                  <div className="help">
                    * Sorry! the requester did not select anyone. This Request will be deleted in 48
                    hours
                  </div>
                </div>
              )}

              {!isPastDue && (
                <div className="field">
                  <label className="label">Bid Status</label>
                  <div className="control has-text-success">{displayStatus}</div>
                  <div className="help">* Make sure to show up on time and do a great job!</div>
                </div>
              )}
              <div className="field">
                <label className="label">Your Bid</label>
                <div className="control has-text-success">{`${bidAmount}$ (${bidCurrency})`}</div>
                <div className="help">* Will be auto paid when you confirm completion.</div>
              </div>
              <StartDateAndTime
                date={startingDateAndTime}
                renderHelpComponent={() => (
                  <CountDownComponent startingDate={startingDateAndTime} isJobStart={false} />
                )}
              />

              <DisplayShortAddress
                addressText={addressText}
                renderHelpComponent={() => (
                  <div className="help">* The Address provided by the requester is revealed</div>
                )}
              />
            </div>
          </div>
          {renderFooter({ bid })}
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
)(TaskerMyAwardedBidHouseCleaningSummary);

const renderFooter = ({ bid }) => {
  return (
    <React.Fragment>
      <div style={{ padding: '0.5rem' }}>
        <hr className="divider isTight" />
      </div>
      <div style={{ padding: '0 0.5rem 0.5rem 0.5rem' }}>
        <a
          style={{ position: 'relative' }}
          onClick={() => {
            switchRoute(ROUTES.CLIENT.BIDDER.dynamicReviewMyBidAndTheRequestDetails(bid._id));
          }}
          className="button is-outlined is-fullwidth is-success"
        >
          <span>View Full Details</span>
        </a>
      </div>
    </React.Fragment>
  );
};
