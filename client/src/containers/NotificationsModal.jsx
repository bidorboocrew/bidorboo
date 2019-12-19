import React from 'react';

import { connect } from 'react-redux';

import * as ROUTES from '../constants/frontend-route-consts';
import { switchRoute } from '../utils';

class NotificationsModal extends React.Component {
  render() {
    const {
      requestIdsWithNewBids,
      myBidsWithNewStatus,
      requestsHappeningToday,
      bidsHappeningToday,
      onClose,
    } = this.props;

    const isAnythingHappeningToday =
      (requestsHappeningToday && requestsHappeningToday.length > 0) ||
      (bidsHappeningToday && bidsHappeningToday.length > 0);

    const didRecieveNewBids = requestIdsWithNewBids && requestIdsWithNewBids.length > 0;

    const didMyBidsGetAwarded = myBidsWithNewStatus && myBidsWithNewStatus.length > 0;
    return (
      <div className="modal is-active">
        <div className="modal-background" onClick={onClose} />
        <button onClick={onClose} className="delete" aria-label="close" />

        <div className="modal-card">
          <section style={{ padding: '6px 0' }} className="modal-card-body">
            {isAnythingHappeningToday && (
              <React.Fragment>
                <div style={{ marginBottom: 8 }} className="tabs">
                  <ul style={{ margin: 0 }}>
                    <li className="is-active">
                      <a>HAPPENING TODAY</a>
                    </li>
                  </ul>
                </div>
                {getAwardedRequestDetailslinks(
                  requestsHappeningToday,
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
                      <a>Requests Inbox UPDATES</a>
                    </li>
                  </ul>
                </div>
                {getReviewRequestlinks(
                  requestIdsWithNewBids,
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
                      <a>MY ASSIGNED TASKS</a>
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
          </section>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ uiReducer }) => {
  const { notificationFeed } = uiReducer;

  const {
    requestIdsWithNewBids,
    myBidsWithNewStatus,
    reviewsToBeFilled,
    workTodo,
    requestsHappeningToday,
    bidsHappeningToday,
  } = notificationFeed;

  return {
    requestIdsWithNewBids,
    myBidsWithNewStatus,
    reviewsToBeFilled,
    workTodo,
    requestsHappeningToday,
    bidsHappeningToday,
  };
};
export default connect(
  mapStateToProps,
  null,
)(NotificationsModal);

const getAwardedRequestDetailslinks = (requests, closeDialog, icon) => {
  if (requests && requests.length > 0) {
    return requests.map((request) => {
      return (
        <div
          style={{
            padding: '0.25em',
            margin: '0.25rem',
            cursor: 'pointer',
            border: ' 1px solid lightgray',
          }}
          key={request._id}
          onClick={() => {
            closeDialog();
            switchRoute(ROUTES.CLIENT.REQUESTER.dynamicSelectedAwardedRequestPage(request._id));
          }}
          className="notification"
        >
          <span className="icon">{icon && icon}</span>
          <span>{`Your ${request.templateId} Request`}</span>
        </div>
      );
    });
  }
  return null;
};
const getReviewRequestlinks = (requests, closeDialog, icon) => {
  if (requests && requests.length > 0) {
    return requests.map((request) => {
      return (
        <div
          key={request._id}
          onClick={() => {
            closeDialog();
            switchRoute(ROUTES.CLIENT.REQUESTER.dynamicReviewRequestAndBidsPage(request._id));
          }}
          className="notification"
          style={{
            padding: '0.25em',
            margin: '0.25rem',
            cursor: 'pointer',
            border: ' 1px solid lightgray',
          }}
        >
          <span className="icon">{icon && icon}</span>
          <span>{`${request._bidsListRef.length} new bid on your ${request.templateId} Request`}</span>
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
            switchRoute(
              ROUTES.CLIENT.TASKER.dynamicReviewMyAwardedBidAndTheRequestDetails(bid._id),
            );
          }}
          style={{
            padding: '0.25em',
            margin: '0.25rem',

            cursor: 'pointer',
            border: ' 1px solid lightgray',
          }}
          className="notification"
        >
          <span className="icon">{icon && icon}</span>
          <span>{`Your bid for ${bid._requestRef.templateId} request has WON!`}</span>
        </div>
      );
    });
  }
  return null;
};
