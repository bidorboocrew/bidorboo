import React from 'react';
import ReactDOM from 'react-dom';
import TextareaAutosize from 'react-autosize-textarea';
import { Collapse } from 'react-collapse';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { cancelRequestById } from '../../app-state/actions/requestActions';

import {
  DisplayLabelValue,
  DestinationAddressValue,
  CountDownComponent,
  TaskSpecificExtras,
  SummaryStartDateAndTime,
  AwaitingOnTasker,
  PastdueExpired,
  RequestCardTitle,
  TaskersAvailable,
  TaskImagesCarousel,
  UserGivenTitle,
} from '../../containers/commonComponents';

import TASKS_DEFINITIONS from '../tasksDefinitions';

class RequesterRequestDetails extends React.Component {
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
    const { request, cancelRequestById } = this.props;

    const {
      startingDateAndTime,
      addressText,
      extras,
      detailedDescription,
      taskImages = [],
      requestTitle,
    } = request;

    const { TITLE, ID, ICON, IMG } = TASKS_DEFINITIONS[`${request.templateId}`];

    let areThereAnyTaskers = request._bidsListRef && request._bidsListRef.length > 0;

    const { showDeleteDialog, showMoreOptionsContextMenu, showMore } = this.state;

    return (
      <React.Fragment>
        {showDeleteDialog &&
          ReactDOM.createPortal(
            <div className="modal is-active">
              <div onClick={this.toggleDeleteConfirmationDialog} className="modal-background" />
              <div className="modal-card">
                <header className="modal-card-head">
                  <div className="modal-card-title">Cancel Request</div>
                  <button
                    onClick={this.toggleDeleteConfirmationDialog}
                    className="delete"
                    aria-label="close"
                  />
                </header>
                <section className="modal-card-body">
                  <div className="content">
                    When you cancel a request we will delete it and all associated bids
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
                    <span className="icon">
                      <i className="far fa-arrow-alt-circle-left" />
                    </span>
                    <span>Go Back</span>
                  </button>
                  <button
                    style={{ width: 160 }}
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      cancelRequestById(request._id);
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
            document.querySelector('body'),
          )}
        <div className={`card has-text-centered cardWithButton nofixedwidth`}>
          <div className="card-content">
            <div className="content">
              <RequestCardTitle
                icon={ICON}
                title={TITLE}
                img={IMG}
                meatballMenu={() => (
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
                        style={{ border: 'none', boxShadow: 'none' }}
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
              />
              <UserGivenTitle userGivenTitle={requestTitle} />

              <TaskImagesCarousel taskImages={taskImages} isLarge />
              <SummaryStartDateAndTime
                date={startingDateAndTime}
                renderHelpComponent={() => (
                  <CountDownComponent startingDate={startingDateAndTime} />
                )}
              />

              {!areThereAnyTaskers && <AwaitingOnTasker />}
              {areThereAnyTaskers && (
                <TaskersAvailable numberOfAvailableTaskers={request._bidsListRef.length} />
              )}
              <Collapse isOpened={showMore}>
                <div style={{ maxWidth: 300, margin: 'auto' }}>
                  <DisplayLabelValue labelText="Address" labelValue={addressText} />
                  {extras && extras.destinationText && (
                    <DestinationAddressValue
                      destionationAddress={extras.destinationText}
                    ></DestinationAddressValue>
                  )}
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
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    cancelRequestById: bindActionCreators(cancelRequestById, dispatch),
  };
};

export default connect(null, mapDispatchToProps)(RequesterRequestDetails);
