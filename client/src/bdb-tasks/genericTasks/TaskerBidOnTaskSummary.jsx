import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { proposerConfirmsJobCompletion, cancelJobById } from '../../app-state/actions/jobActions';
import { showLoginDialog } from '../../app-state/actions/uiActions';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
import TASKS_DEFINITIONS from '../tasksDefinitions';

import {
  AvgBidDisplayLabelAndValue,
  UserImageAndRating,
  CardTitleAndActionsInfo,
  StartDateAndTime,
  TaskSpecificExtras,
  CountDownComponent,
} from '../../containers/commonComponents';

import { getUserExistingBid, didUserAlreadyView } from '../../containers/commonUtils';

import RequestBaseContainer from '../RequestBaseContainer';

class TaskerBidOnHouseCleaningSummary extends RequestBaseContainer {
  render() {
    const { job, otherArgs, isLoggedIn, userDetails, showLoginDialog } = this.props;

    if (
      !job ||
      !job._id ||
      !otherArgs ||
      isLoggedIn === 'undefined' ||
      !userDetails ||
      !showLoginDialog
    ) {
      return <div>TaskerBidOnHouseCleaningSummary is missing properties</div>;
    }

    const { _id: currentUserId } = userDetails;
    if (!currentUserId) {
      return <div>TaskerBidOnHouseCleaningSummary is missing properties</div>;
    }

    const { onCloseHandler = () => null, isOnMapView = false } = otherArgs;
    if (!onCloseHandler || isOnMapView === 'undefined') {
      return <div>TaskerBidOnHouseCleaningSummary is missing properties</div>;
    }

    const {
      reactMapClusterRef,
      startingDateAndTime,
      templateId,
      _bidsListRef,
      _ownerRef,
      state,
      extras,
    } = job;
    if (!startingDateAndTime || !templateId || !_ownerRef || !state || !extras) {
      return <div>TaskerBidOnHouseCleaningSummary is missing properties</div>;
    }

    const { TITLE, ID } = TASKS_DEFINITIONS[`${job.templateId}`];
    if (!TITLE || !ID) {
      return switchRoute(ROUTES.CLIENT.BIDDER.root);
    }

    const { userAlreadyBid, userExistingBid } = getUserExistingBid(job, currentUserId);
    const userAlreadyView = didUserAlreadyView(job, currentUserId);

    return (
      <div className={`card is-clipped ${isOnMapView ? 'bdb-infoBoxCard' : 'limitWidthOfCard'}`}>
        <div style={{ minHeight: isOnMapView ? 'unset' : '22rem' }} className="card-content">
          <div className="content">
            <CardTitleAndActionsInfo
              isOnMapView={isOnMapView}
              userAlreadyBid={userAlreadyBid}
              jobState={state}
              templateId={templateId}
              bidsList={_bidsListRef}
              userAlreadyView={userAlreadyView}
            />
            <hr className="divider isTight" />
            <div className="field">
              <label className="label">Requester:</label>
              <UserImageAndRating clipUserName userDetails={_ownerRef} />
            </div>
            <StartDateAndTime
              date={startingDateAndTime}
              renderHelpComponent={() => <CountDownComponent startingDate={startingDateAndTime} />}
            />
            {!isOnMapView && <TaskSpecificExtras templateId={ID} extras={extras} />}
            {!isOnMapView && <AvgBidDisplayLabelAndValue bidsList={_bidsListRef} />}
          </div>
          {!isOnMapView && (
            <React.Fragment>
              <hr className="divider isTight" />

              {userAlreadyBid ? (
                <div style={{ display: 'flex' }}>
                  <a
                    style={{ flexGrow: 1 }}
                    onClick={(e) => {
                      e.preventDefault();
                      switchRoute(
                        ROUTES.CLIENT.BIDDER.dynamicReviewMyOpenBidAndTheRequestDetails(
                          userExistingBid._id,
                        ),
                      );
                    }}
                    className="button  is-outlined is-fullwidth"
                  >
                    View My Bid
                  </a>
                  <a
                    style={{ marginLeft: 12 }}
                    onClick={(e) => {
                      const markerRef = reactMapClusterRef;
                      if (
                        markerRef &&
                        markerRef.current &&
                        markerRef.current.props &&
                        markerRef.current.props.onClick &&
                        typeof markerRef.current.props.onClick === 'function'
                      ) {
                        markerRef.current.props.onClick();
                      }
                    }}
                    className="button is-outlined"
                  >
                    <span className="icon">
                      <i className="fas fa-map-marked-alt" />
                    </span>
                    {/* <span>Locate</span> */}
                  </a>
                </div>
              ) : (
                <div style={{ display: 'flex' }}>
                  <a
                    style={{ flexGrow: 1 }}
                    onClick={(e) => {
                      if (!isLoggedIn) {
                        showLoginDialog(true);
                        return;
                      } else {
                        switchRoute(ROUTES.CLIENT.BIDDER.getDynamicBidOnJobPage(job._id));
                      }
                    }}
                    className="button is-success is-outlined"
                  >
                    Place Your Bid!
                  </a>

                  <a
                    style={{ marginLeft: 12 }}
                    onClick={(e) => {
                      const markerRef = reactMapClusterRef;
                      if (
                        markerRef &&
                        markerRef.current &&
                        markerRef.current.props &&
                        markerRef.current.props.onClick &&
                        typeof markerRef.current.props.onClick === 'function'
                      ) {
                        markerRef.current.props.onClick();
                      }
                    }}
                    className="button is-outlined"
                  >
                    <span className="icon">
                      <i className="fas fa-map-marked-alt" />
                    </span>
                    {/* <span>Locate</span> */}
                  </a>
                </div>
              )}
            </React.Fragment>
          )}
          {isOnMapView && (
            <React.Fragment>
              {userAlreadyBid ? (
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    switchRoute(
                      ROUTES.CLIENT.BIDDER.dynamicReviewMyOpenBidAndTheRequestDetails(
                        userExistingBid._id,
                      ),
                    );
                  }}
                  className="button is-outlined is-small is-fullwidth"
                >
                  View Your existing Bid
                </a>
              ) : (
                <a
                  style={{ marginTop: 10 }}
                  onClick={(e) => {
                    if (!isLoggedIn) {
                      showLoginDialog(true);
                      return;
                    } else {
                      switchRoute(ROUTES.CLIENT.BIDDER.getDynamicBidOnJobPage(job._id));
                    }
                  }}
                  className="button is-success is-small is-outlined is-fullwidth"
                >
                  Place Your Bid!
                </a>
              )}
              <a
                style={{ marginTop: 10 }}
                onClick={onCloseHandler}
                className="button is-outlined is-small is-fullwidth"
              >
                Close
              </a>
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ jobsReducer, userReducer, uiReducer }) => {
  return {
    isLoggedIn: userReducer.isLoggedIn,
    selectedAwardedJob: jobsReducer.selectedAwardedJob,
    userDetails: userReducer.userDetails,
    notificationFeed: uiReducer.notificationFeed,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    proposerConfirmsJobCompletion: bindActionCreators(proposerConfirmsJobCompletion, dispatch),
    cancelJobById: bindActionCreators(cancelJobById, dispatch),
    showLoginDialog: bindActionCreators(showLoginDialog, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TaskerBidOnHouseCleaningSummary);
