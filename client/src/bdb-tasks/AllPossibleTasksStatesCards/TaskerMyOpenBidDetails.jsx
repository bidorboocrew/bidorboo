import React from 'react';
import ReactDOM from 'react-dom';
import TextareaAutosize from 'react-autosize-textarea';
import { Collapse } from 'react-collapse';

import TASKS_DEFINITIONS from '../tasksDefinitions';

import {
  CountDownComponent,
  CenteredUserImageAndRating,
  AvgBidDisplayLabelAndValue,
  LocationLabelAndValue,
  DestinationAddressValue,
  TaskSpecificExtras,
  SummaryStartDateAndTime,
  BSawaitingOnRequester,
  RequestCardTitle,
  TaskImagesCarousel,
  UserGivenTitle,
  BidAmount,
  TaskerWillEarn,
} from '../../containers/commonComponents';
import TaskerEditOrUpdateBid from '../../containers/tasker-flow/components/TaskerEditOrUpdateBid';

export default class TaskerMyOpenBidDetails extends React.Component {
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
    const { bid, request, otherArgs } = this.props;

    const {
      startingDateAndTime,
      _ownerRef,
      detailedDescription,
      location,
      extras,
      taskImages = [],
      requestTitle,
    } = request;

    const { taskerPayout, bidAmount } = bid;
    const { value: bidValue } = bidAmount;

    const { value: taskerPayoutAmount } = taskerPayout;

    const { updateBid, deleteOpenBid } = otherArgs;

    const { TITLE, ID, ICON, IMG } = TASKS_DEFINITIONS[`${request.templateId}`];

    const { showMore, showDeleteDialog, showMoreOptionsContextMenu } = this.state;

    return (
      <React.Fragment>
        {showDeleteDialog &&
          ReactDOM.createPortal(
            <div className="modal is-active">
              <div onClick={this.toggleDeleteConfirmationDialog} className="modal-background" />
              <div className="modal-card">
                <header className="modal-card-head">
                  <div className="modal-card-title">Delete Bid</div>
                  <button
                    onClick={this.toggleDeleteConfirmationDialog}
                    className="delete"
                    aria-label="close"
                  />
                </header>
                <section className="modal-card-body">
                  <div className="content">
                    Are you sure you want to delete your bid on this task?
                    <br />
                    <p>You can always edit your bid as long as the Requester did not award a bid</p>
                  </div>
                  <div className="help">*This action will NOT affect your ratings.</div>
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
                      deleteOpenBid(bid._id);
                      this.toggleDeleteConfirmationDialog();
                    }}
                    className="button is-danger"
                  >
                    <span className="icon">
                      <i className="far fa-trash-alt" />
                    </span>
                    <span>Delete My Bid</span>
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
                          <span>Delete Bid</span>
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

              <BSawaitingOnRequester />

              <BidAmount bidAmount={bidValue}></BidAmount>

              <Collapse isOpened={showMore}>
                <div style={{ maxWidth: 300, margin: 'auto' }}>
                  <TaskerWillEarn earningAmount={taskerPayoutAmount}></TaskerWillEarn>

                  <div className="group">
                    <label className="label hasSelectedValue">Requester</label>
                    <CenteredUserImageAndRating userDetails={_ownerRef} isCentered />
                  </div>
                  <TaskSpecificExtras templateId={ID} extras={extras} />
                  <LocationLabelAndValue location={location.coordinates} />
                  {extras && extras.destinationText && (
                    <DestinationAddressValue
                      destionationAddress={extras.destinationText}
                    ></DestinationAddressValue>
                  )}
                  <AvgBidDisplayLabelAndValue avgBid={request.avgBid} />

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
              <br />
              <TaskerEditOrUpdateBid bid={bid} request={request} updateBidAction={updateBid} />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
