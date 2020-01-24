import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateRequestState } from '../../app-state/actions/requestActions';

import { REQUEST_STATES } from '../index';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';
import {
  CountDownComponent,
  SummaryStartDateAndTime,
  BSTaskerAwarded,
  RequestCardTitle,
  TaskImagesCarousel,
  UserGivenTitle,
  TaskerWillEarn,
  BSWaitingOnRequesterToConfirm,
  BSAwardedToSomeoneElse,
  BidAmount,
} from '../../containers/commonComponents';

import TASKS_DEFINITIONS from '../tasksDefinitions';

class TaskerMyAwardedBidSummary extends React.Component {
  render() {
    const { bid, request, notificationFeed, updateRequestState } = this.props;

    const {
      startingDateAndTime,
      taskerConfirmedCompletion,
      taskImages = [],
      requestTitle,
    } = request;

    const { TITLE, ICON, IMG } = TASKS_DEFINITIONS[`${request.templateId}`];
    const { taskerPayout, isAwardedToMe, bidAmount } = bid;
    const { value: bidValue } = bidAmount;

    const { value: taskerTotalPayoutAmount } = taskerPayout;

    return (
      <React.Fragment>
        <div
          style={{ border: '1px solid #26ca70' }}
          className={`card has-text-centered cardWithButton`}
        >
          <div className="card-content">
            <div className="content">
              <RequestCardTitle
                icon={ICON}
                title={TITLE}
                img={taskImages && taskImages.length > 0 ? taskImages[0].url : IMG}
              />
              <UserGivenTitle userGivenTitle={requestTitle} />
              <TaskImagesCarousel taskImages={taskImages} />
              <SummaryStartDateAndTime
                date={startingDateAndTime}
                renderHelpComponent={() => (
                  <CountDownComponent startingDate={startingDateAndTime} />
                )}
              />

              {isAwardedToMe && (
                <>
                  {taskerConfirmedCompletion && <BSWaitingOnRequesterToConfirm />}

                  {!taskerConfirmedCompletion && <BSTaskerAwarded />}
                </>
              )}
              {!isAwardedToMe && <BSAwardedToSomeoneElse />}
              <BidAmount bidAmount={bidValue} />
            </div>
          </div>
          {isAwardedToMe &&
            renderFooter({
              isAwardedToMe,
              request,
              bid,
              notificationFeed,
              updateRequestState,
              taskerConfirmedCompletion,
            })}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ uiReducer }) => {
  return {
    notificationFeed: uiReducer.notificationFeed,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    updateRequestState: bindActionCreators(updateRequestState, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskerMyAwardedBidSummary);

const renderFooter = ({
  request,
  bid,
  notificationFeed,
  updateRequestState,
  taskerConfirmedCompletion,
}) => {
  let newUnseenState = false;
  if (notificationFeed && notificationFeed.myBidsWithNewStatus) {
    for (let i = 0; i < notificationFeed.myBidsWithNewStatus.length; i++) {
      if (notificationFeed.myBidsWithNewStatus[i]._id === bid._id) {
        newUnseenState = true;
        break;
      }
    }
  }
  return (
    <React.Fragment>
      <div className="centeredButtonInCard">
        <a
          style={{ position: 'relative' }}
          onClick={(e) => {
            e.preventDefault();
            newUnseenState && updateRequestState(request._id, REQUEST_STATES.AWARDED_SEEN);

            switchRoute(
              ROUTES.CLIENT.TASKER.dynamicReviewMyAwardedBidAndTheRequestDetails(bid._id),
            );
          }}
          className="button is-success"
        >
          {newUnseenState && (
            <div
              style={{ position: 'absolute', top: -5, right: 0, fontSize: 10 }}
              className="has-text-danger"
            >
              <i className="fas fa-circle" />
            </div>
          )}
          {`${taskerConfirmedCompletion ? 'Review Requester' : 'View Details'} `}
        </a>
      </div>
    </React.Fragment>
  );
};
