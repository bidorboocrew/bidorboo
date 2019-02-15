import React from 'react';
import ReactDOM from 'react-dom';

import { switchRoute } from '../../../utils';
import * as ROUTES from '../../../constants/frontend-route-consts';

import { templatesRepo } from '../../../constants/bidOrBooTaskRepo';

import { DisplayLabelValue, CountDownComponent, StartDateAndTime } from '../../commonComponents';

export default class JobSummaryForPostedJobs extends React.Component {
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

    const { startingDateAndTime, fromTemplateId, _bidsListRef, addressText } = job;

    const { showDeleteDialog } = this.state;

    return (
      <React.Fragment>
        {showDeleteDialog &&
          ReactDOM.createPortal(
            <div className="modal is-active">
              <div onClick={this.toggleDeleteConfirmationDialog} className="modal-background" />
              <div className="modal-card">
                <section className="modal-card-body">
                  <p className="title">Delete {templatesRepo[fromTemplateId].title} Request</p>
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
            switchRoute(`${ROUTES.CLIENT.PROPOSER.reviewRequestAndBidsPage}/${job._id}`);
          }}
          className="card bidderRootSpecial is-clipped"
        >
          <header
            style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
            className="card-header is-clipped"
          >
            <p className="card-header-title">{templatesRepo[fromTemplateId].title}</p>

            <a
              className={`card-header-icon ${
                _bidsListRef && _bidsListRef.length === 0 ? 'has-text-grey' : 'has-text-success'
              }`}
            >
              <span className="icon">
                <i className="fas fa-hand-paper" />
              </span>
              <span>{`${_bidsListRef ? _bidsListRef.length : 0} bids`}</span>
            </a>

            <a
              className="card-header-icon"
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
          </header>
          <div className="card-image is-clipped">
            <img className="bdb-cover-img" src={`${templatesRepo[fromTemplateId].imageUrl}`} />
          </div>
          <div
            style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem', position: 'relative' }}
            className="card-content"
          >
            <div className="content">
              <StartDateAndTime date={startingDateAndTime} />

              <DisplayLabelValue labelText="Address:" labelValue={addressText} />
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
    <footer className="card-footer">
      <div className="card-footer-item">
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
                <i className="fas fa-bullseye" />
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
      </div>
    </footer>
  );
};
