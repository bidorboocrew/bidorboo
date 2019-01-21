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
              <div className="content">
                {isAnythingHappeningToday && (
                  <React.Fragment>
                    <div style={{ marginBottom: 8 }} className="tabs">
                      <ul style={{ margin: 0 }}>
                        <li className="is-active">
                          <a>HAPPENING TODAY</a>
                        </li>
                      </ul>
                    </div>
                    {getAwardedJobDetailslinks(jobsHappeningToday, onClose)}
                    {getAwardedBidsDetailslinks(bidsHappeningToday, onClose)}
                  </React.Fragment>
                )}
                {didRecieveNewBids && (
                  <React.Fragment>
                    <div style={{ marginBottom: 8, marginTop: 12 }} className="tabs">
                      <ul style={{ margin: 0 }}>
                        <li className="is-active">
                          <a>Request Updates</a>
                        </li>
                      </ul>
                    </div>
                    {getReviewJoblinks(jobIdsWithNewBids, onClose)}
                  </React.Fragment>
                )}
                {didMyBidsGetAwarded && (
                  <React.Fragment>
                    <div style={{ marginBottom: 8, marginTop: 12 }} className="tabs">
                      <ul style={{ margin: 0 }}>
                        <li className="is-active">
                          <a>Awarded Bids</a>
                        </li>
                      </ul>
                    </div>
                    {getAwardedBidsDetailslinks(myBidsWithNewStatus, onClose)}
                  </React.Fragment>
                )}
              </div>
              <button onClick={onClose} className="modal-close" aria-label="close" />
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

const getAwardedJobDetailslinks = (jobs, closeDialog) => {
  if (jobs && jobs.length > 0) {
    return jobs.map((job) => {
      return (
        <div
          key={job._id}
          onClick={() => {
            closeDialog();
            switchRoute(`${ROUTES.CLIENT.PROPOSER.selectedAwardedJobPage}/${job._id}`);
          }}
          style={{ padding: '0.5em 1em', marginBottom: 6 }}
          className="notification"
        >
          {`Your ${job.fromTemplateId} Request is scheduled for today`}
        </div>
      );
    });
  }
  return null;
};
const getReviewJoblinks = (jobs, closeDialog) => {
  if (jobs && jobs.length > 0) {
    return jobs.map((job) => {
      return (
        <div
          key={job._id}
          onClick={() => {
            closeDialog();
            switchRoute(`${ROUTES.CLIENT.PROPOSER.reviewRequestAndBidsPage}/${job._id}`);
          }}
          style={{ padding: '0.5em 1em', marginBottom: 6 }}
          className="notification"
        >
          {`${job._bidsListRef.length} new bid on your ${job.fromTemplateId} Request`}
        </div>
      );
    });
  }
  return null;
};

const getAwardedBidsDetailslinks = (bids, closeDialog) => {
  if (bids && bids.length > 0) {
    return bids.map((bid) => {
      return (
        <div
          key={bid._id}
          onClick={() => {
            closeDialog();
            switchRoute(`${ROUTES.CLIENT.BIDDER.currentAwardedBid}/${bid._id}`);
          }}
          style={{ padding: '0.5em 1em', marginBottom: 6 }}
          className="notification"
        >
          {`Your ${bid.bidAmount.value} CAD bid for ${bid._jobRef.fromTemplateId} WON!`}
        </div>
      );
    });
  }
  return null;
};
