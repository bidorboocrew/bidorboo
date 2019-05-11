import React from 'react';

import { connect } from 'react-redux';

import * as ROUTES from '../constants/frontend-route-consts';
import { switchRoute } from '../utils';

class NotificationsModal extends React.Component {
  render() {
    const {
      jobIdsWithNewBids,
      myBidsWithNewStatus,
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
            <div style={{ padding: 0 }} className="card-content">
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
                    {getAwardedJobDetailslinks(
                      jobsHappeningToday,
                      onClose,
                      <span className="icon">
                        <i className="far fa-clock" />
                      </span>,
                    )}
                    {getAwardedBidsDetailslinks(
                      bidsHappeningToday,
                      onClose,
                      <span className="icon">
                        <i className="far fa-clock" />
                      </span>,
                    )}
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
                    {getReviewJoblinks(
                      jobIdsWithNewBids,
                      onClose,
                      <span className="icon">
                        <i className="far fa-plus-square" />
                      </span>,
                    )}
                  </React.Fragment>
                )}
                {didMyBidsGetAwarded && (
                  <React.Fragment>
                    <div style={{ marginBottom: 8, marginTop: 12 }} className="tabs">
                      <ul style={{ margin: 0 }}>
                        <li className="is-active">
                          <a>Upcoming Tasks</a>
                        </li>
                      </ul>
                    </div>
                    {getAwardedBidsDetailslinks(
                      myBidsWithNewStatus,
                      onClose,
                      <span className="icon">
                        <i className="fas fa-hand-rock" />
                      </span>,
                    )}
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

const getAwardedJobDetailslinks = (jobs, closeDialog, icon) => {
  if (jobs && jobs.length > 0) {
    return jobs.map((job) => {
      return (
        <div
          key={job._id}
          onClick={() => {
            closeDialog();
            switchRoute(ROUTES.CLIENT.PROPOSER.dynamicSelectedAwardedJobPage(job._id));
          }}
          style={{ padding: '0.5em 1em', marginBottom: 6 }}
          className="notification"
        >
          {icon && icon}
          <span>{`Your ${job.fromTemplateId} Request is scheduled for today`}</span>
        </div>
      );
    });
  }
  return null;
};
const getReviewJoblinks = (jobs, closeDialog, icon) => {
  if (jobs && jobs.length > 0) {
    return jobs.map((job) => {
      return (
        <div
          key={job._id}
          onClick={() => {
            closeDialog();
            switchRoute(ROUTES.CLIENT.PROPOSER.dynamicReviewRequestAndBidsPage(job._id));
          }}
          style={{ padding: '0.5em 1em', marginBottom: 6 }}
          className="notification"
        >
          {icon && icon}
          <span>{`${job._bidsListRef.length} new bid on your ${job.fromTemplateId} Request`}</span>
        </div>
      );
    });
  }
  return null;
};

const getAwardedBidsDetailslinks = (bids, closeDialog, icon) => {
  if (bids && bids.length > 0) {
    return bids.map((bid) => {
      return (
        <div
          key={bid._id}
          onClick={() => {
            closeDialog();
            switchRoute(ROUTES.CLIENT.BIDDER.dynamicCurrentAwardedBid(bid._id));
          }}
          style={{ padding: '0.5em 1em', marginBottom: 6 }}
          className="notification"
        >
          {icon && icon}
          <span>
            {`Your ${bid.bidAmount.value} CAD bid for ${bid._jobRef.fromTemplateId} WON!`}
          </span>
        </div>
      );
    });
  }
  return null;
};
