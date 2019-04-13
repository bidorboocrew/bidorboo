import React from 'react';
import ReactDOM from 'react-dom';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';

import {
  DisplayLabelValue,
  CountDownComponent,
  StartDateAndTime,
  JobTitleText,
} from '../../containers/commonComponents';

import { HOUSE_CLEANING_DEF } from './houseCleaningDefinition';

export default class HouseCleaningRequestSummary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showDeleteDialog: false,
    };
  }

  toggleDeleteConfirmationDialog = () => {
    this.setState({ showDeleteDialog: !this.state.showDeleteDialog });
  };

  render() {
    const { job, deleteJob, notificationFeed } = this.props;

    const { startingDateAndTime, _bidsListRef, addressText } = job;

    const { showDeleteDialog } = this.state;
    const { TITLE, IMG_URL } = HOUSE_CLEANING_DEF;

    return (
      <React.Fragment>
        {showDeleteDialog &&
          ReactDOM.createPortal(
            <div className="modal is-active">
              <div onClick={this.toggleDeleteConfirmationDialog} className="modal-background" />
              <div className="modal-card">
                <section className="modal-card-body">
                  <p className="title">Delete {TITLE} Request</p>
                  <br />
                  <p className="subtitle">
                    When you delete a job we will delete all the existing bids. <br /> You can
                    always post a similar request at another time
                  </p>
                  <div className="help">*This action will NOT affect your ratings.</div>
                </section>
                <footer style={{ borderTop: 0, paddingTop: 0 }} className="modal-card-foot">
                  <button
                    style={{ width: 140 }}
                    onClick={this.toggleDeleteConfirmationDialog}
                    className="button is-outline"
                  >
                    <span>Cancel</span>
                  </button>
                  <button
                    style={{ width: 140 }}
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
                    <span>Delete</span>
                  </button>
                </footer>
              </div>
            </div>,
            document.querySelector('#bidorboo-root-modals'),
          )}
        <div
          onClick={(e) => {
            e.preventDefault();
            switchRoute(ROUTES.CLIENT.PROPOSER.dynamicReviewRequestAndBidsPage(job._id));
          }}
          className="card limitWidthOfCard is-clipped"
        >
          <div className="card-image is-clipped">
            <img className="bdb-cover-img" src={IMG_URL} />
          </div>
          <div className="card-content">
            <div className="content">
              <JobTitleText title={TITLE} />
              <div className="field">
                <label className="label">Task info</label>
                <div>
                  <a
                    className={`${
                      _bidsListRef && _bidsListRef.length === 0
                        ? 'has-text-grey'
                        : 'has-text-success'
                    }`}
                  >
                    <span className="icon">
                      <i className="fas fa-hand-paper" />
                    </span>
                    <span>{`${_bidsListRef ? _bidsListRef.length : 0} bids`}</span>
                  </a>

                  <a
                    aria-label="more options"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      this.toggleDeleteConfirmationDialog();
                    }}
                  >
                    <span style={{ color: 'grey' }} className="icon">
                      <i className="far fa-trash-alt" aria-hidden="true" />
                    </span>
                  </a>
                </div>
              </div>
              <StartDateAndTime date={startingDateAndTime} />

              <DisplayLabelValue labelText="Address" labelValue={addressText} />
            </div>
          </div>
          {renderFooter({ job, notificationFeed })}
          <CountDownComponent startingDate={startingDateAndTime} isJobStart={false} />
        </div>
      </React.Fragment>
    );
  }
}

const renderFooter = ({ job, notificationFeed }) => {
  let areThereAnyBidders = job._bidsListRef && job._bidsListRef.length > 0;
  let doesthisJobHaveNewBids = false;
  let numberOfNewBids = 0;

  if (notificationFeed.jobIdsWithNewBids) {
    for (let i = 0; i < notificationFeed.jobIdsWithNewBids.length; i++) {
      if (notificationFeed.jobIdsWithNewBids[i]._id === job._id) {
        doesthisJobHaveNewBids = true;
        numberOfNewBids = notificationFeed.jobIdsWithNewBids[i]._bidsListRef.length;
        break;
      }
    }
  }

  return (
    <React.Fragment>
      <br />
      <a className={`button is-fullwidth ${areThereAnyBidders ? 'is-success' : 'is-outline'}`}>
        {areThereAnyBidders && (
          <span style={{ marginLeft: 4 }}>
            <span className="icon">
              <i className="fa fa-hand-paper" />
            </span>
            <span>View Bids</span>
          </span>
        )}
        {!areThereAnyBidders && (
          <span style={{ marginLeft: 4 }}>
            <span className="icon">
              <i className="far fa-eye" />
            </span>
            <span>View Details</span>
          </span>
        )}
        {areThereAnyBidders && doesthisJobHaveNewBids && (
          <span style={{ marginLeft: 4 }} className="tag is-danger">
            +{numberOfNewBids}
          </span>
        )}
      </a>
    </React.Fragment>
  );
};
