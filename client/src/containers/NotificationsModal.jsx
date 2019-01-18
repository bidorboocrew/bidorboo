import React from 'react';

import { connect } from 'react-redux';

import * as ROUTES from '../constants/frontend-route-consts';
import { switchRoute } from '../utils';

class NotificationsModal extends React.Component {
  render() {
    const {
      jobIdsWithNewBids,
      myBidsWithNewStatus,
      reviewsToBeFilled,
      workTodo,
      jobsHappeningToday,
      bidsHappeningToday,
      onClose,
    } = this.props;

    const isAnythingHappeningToday =
      (jobsHappeningToday && jobsHappeningToday.length > 0) ||
      (bidsHappeningToday && bidsHappeningToday.length > 0);

    const didRecieveNewBids = jobIdsWithNewBids && jobIdsWithNewBids.length > 0;

    const didMyBidsGetAwarded = myBidsWithNewStatus && myBidsWithNewStatus.length > 0;
    return (
      <div className="modal is-active">
        <div className="modal-background" onClick={onClose} />
        <div className="modal-content">
          <div className="card">
            <div className="card-content">
              <div className="content has-text-centered">
                {isAnythingHappeningToday && (
                  <React.Fragment>
                    <div className="tabs is-centered">
                      <ul>
                        <li>
                          <a>Happening Today</a>
                        </li>
                      </ul>
                    </div>
                    {getAwardedJobDetailslinks(jobsHappeningToday, onClose)}
                    {getAwardedBidsDetailslinks(bidsHappeningToday, onClose)}
                  </React.Fragment>
                )}
                {didRecieveNewBids && (
                  <React.Fragment>
                    <div className="tabs is-centered">
                      <ul>
                        <li>
                          <a>Recieved New Bids</a>
                        </li>
                      </ul>
                    </div>
                    {getReviewJoblinks(jobIdsWithNewBids, onClose)}
                  </React.Fragment>
                )}
                {didMyBidsGetAwarded && (
                  <React.Fragment>
                    <div className="tabs is-centered">
                      <ul>
                        <li>
                          <a>New Awarded Bids</a>
                        </li>
                      </ul>
                    </div>
                    {getAwardedBidsDetailslinks(myBidsWithNewStatus, onClose)}
                  </React.Fragment>
                )}
              </div>
              <button onClick={onClose} className="modal-close is-large" aria-label="close" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ uiReducer }) => {
  const { notificationFeed } = uiReducer;

  const {
    jobIdsWithNewBids,
    myBidsWithNewStatus,
    reviewsToBeFilled,
    workTodo,
    jobsHappeningToday,
    bidsHappeningToday,
  } = notificationFeed;

  return {
    jobIdsWithNewBids,
    myBidsWithNewStatus,
    reviewsToBeFilled,
    workTodo,
    jobsHappeningToday,
    bidsHappeningToday,
  };
};
export default connect(
  mapStateToProps,
  null,
)(NotificationsModal);

const getAwardedJobDetailslinks = (jobIds, closeDialog) => {
  if (jobIds && jobIds.length > 0) {
    return jobIds.map((jobId) => {
      return (
        <div
          key={jobId}
          onClick={() => {
            closeDialog();
            switchRoute(`${ROUTES.CLIENT.PROPOSER.selectedAwardedJobPage}/${jobId}`);
          }}
          style={{ padding: 2 }}
          className="notification is-info"
        >
          Job {`${ROUTES.CLIENT.PROPOSER.selectedAwardedJobPage}/${jobId}`}
        </div>
      );
    });
  }
  return null;
};
const getAwardedBidsDetailslinks = (bids, closeDialog) => {
  if (bids && bids.length > 0) {
    return bids.map((bid) => {
      debugger;
      return (
        <div
          key={bid._id}
          onClick={() => {
            closeDialog();
            switchRoute(`${ROUTES.CLIENT.BIDDER.currentAwardedBid}/${bid._id}`);
          }}
          style={{ padding: 2 }}
          className="notification is-info"
        >
          Bid {`${ROUTES.CLIENT.BIDDER.currentAwardedBid}/${bid._id}`}
        </div>
      );
    });
  }
  return null;
};

const getReviewJoblinks = (jobs, closeDialog) => {
  if (jobs && jobs.length > 0) {
    const notificationEvents = jobs.map((job) => {
      return (
        <div
          key={job._id}
          onClick={() => {
            closeDialog();
            switchRoute(`${ROUTES.CLIENT.PROPOSER.reviewRequestAndBidsPage}/${job._id}`);
          }}
          style={{ padding: 2 }}
          className="notification is-info"
        >
          Job {`${ROUTES.CLIENT.PROPOSER.reviewRequestAndBidsPage}/${job._id}`}
        </div>
      );
    });

    return notificationEvents;
  }
  return null;
};

const getReviewLinkds = () => {};
