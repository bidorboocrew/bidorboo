import React from 'react';
import ReactDOM from 'react-dom';
import TextareaAutosize from 'react-autosize-textarea';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  DisplayLabelValue,
  CountDownComponent,
  StartDateAndTime,
} from '../../containers/commonComponents';
import { proposerConfirmsJobCompletion, cancelJobById } from '../../app-state/actions/jobActions';

import { HOUSE_CLEANING_DEF } from './houseCleaningDefinition';

class HouseCleaningPostedRequestDetails extends React.Component {
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
    const { job, deleteJob, ommitMeatballMenu, cancelJobById } = this.props;

    const {
      startingDateAndTime,
      addressText,
      extras,
      detailedDescription,
      isExpiringSoon,
      isHappeningToday,
      isPastDue,
    } = job;

    const { showDeleteDialog, showMoreOptionsContextMenu, showMore } = this.state;
    const { TITLE, IMG_URL } = HOUSE_CLEANING_DEF;
    let areThereAnyBidders = job._bidsListRef && job._bidsListRef.length > 0;

    const effortLevel =
      extras && extras.effort ? (
        <DisplayLabelValue labelText="Effort" labelValue={extras.effort} />
      ) : (
        <DisplayLabelValue labelText="Effort" labelValue={'not specified'} />
      );

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
        <div style={{ height: 'unset' }} className={`card  ${isPastDue ? 'expiredReadOnly' : ''}`}>
          <div className="card-image">
            <img className="bdb-cover-img" src={IMG_URL} />
          </div>
          <div className="card-content">
            <div className="content">
              <div style={{ display: 'flex' }}>
                <div style={{ flexGrow: 1 }} className="is-size-4 has-text-weight-bold">
                  {TITLE}
                </div>

                {!ommitMeatballMenu && (
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
                  <div className="help">
                    * No Taskers were assigned before the specified start date thus, we will delete
                    this request automatically in 48hours.
                  </div>
                </div>
              )}

              {!isPastDue && (
                <React.Fragment>
                  {!areThereAnyBidders && (
                    <div className="field">
                      <label className="label">Request Status</label>
                      <div className="control">Awaiting on Taskers</div>
                      <div className="help">
                        * No Taskers offered to do this yet! check again soon.
                      </div>
                      {isExpiringSoon ||
                        (isHappeningToday && (
                          <div className="help has-text-success">
                            * Expiring soon, if no Taskers are available to fulfil this request, we
                            will deleted it automatically 48 hours after the specified start date
                          </div>
                        ))}
                    </div>
                  )}
                  {areThereAnyBidders && (
                    <div className="field">
                      <label className="label">Request Status</label>
                      <div className="control has-text-info">Taskers Available</div>
                      <div className="help">* Review the offers regularly and choose a Tasker.</div>
                      {isExpiringSoon ||
                        (isHappeningToday && (
                          <div className="help has-text-success">
                            * Expiring soon, select a Taskers otherwise this task will be deleted
                            automatically 48 hours after the specified start date
                          </div>
                        ))}
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

              <DisplayLabelValue labelText="Address" labelValue={addressText} />
              {showMore && (
                <React.Fragment>
                  {effortLevel}
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
            </div>
          </div>
          <div style={{ padding: '0.5rem' }}>
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
)(HouseCleaningPostedRequestDetails);
