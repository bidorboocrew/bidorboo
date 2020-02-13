import React from 'react';
// import ReactDOM from 'react-dom';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as A from '../../app-state/actionTypes';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
import TASKS_DEFINITIONS from '../tasksDefinitions';

import {
  SummaryStartDateAndTime,
  CardTitleAndActionsInfo,
  RequestCardTitle,
  CountDownComponent,
  // TaskImagesCarousel,
  CenteredUserImageAndRating,
  UserGivenTitle,
  RequestCardTitleOnMap,
  UserGivenTitleOnMap,
  SummaryStartDateAndTimeOnMap,
} from '../../containers/commonComponents';

import { didUserAlreadyView } from '../../containers/commonUtils';

import RequestBaseContainer from './RequestBaseContainer';

class TaskerBidOnTaskSummary extends RequestBaseContainer {
  render() {
    const { request, otherArgs = {}, dispatch } = this.props;
    // const { showRegisterAsTaskerModal } = this.state;
    const { showMapView, isLoggedIn, userDetails, updateViewedBy } = otherArgs;

    const { _id: currentUserId, canBid } = userDetails;

    const { onCloseHandler = () => null, isOnMapView = false } = otherArgs;

    const {
      reactMapClusterRef,
      startingDateAndTime,
      templateId,
      _bidsListRef,
      _ownerRef,
      state,
      taskImages = [],
      requestTitle,
    } = request;

    const { TITLE, ICON, IMG } = TASKS_DEFINITIONS[`${request.templateId}`];

    const userAlreadyView = didUserAlreadyView(request, currentUserId);

    const specialStyle = isOnMapView ? { padding: '0.75rem' } : {};
    const specialStyleCard = isOnMapView ? { maxWidth: 200 } : {};

    return (
      <React.Fragment>
        <div style={{ ...specialStyleCard }} className="card has-text-centered cardWithButton">
          <div style={{ ...specialStyle }} className="card-content">
            <div className="content">
              {isOnMapView ? (
                <RequestCardTitleOnMap
                  icon={ICON}
                  title={TITLE}
                  img={taskImages && taskImages.length > 0 ? taskImages[0].url : IMG}
                />
              ) : (
                <RequestCardTitle
                  icon={ICON}
                  title={TITLE}
                  img={taskImages && taskImages.length > 0 ? taskImages[0].url : IMG}
                />
              )}

              {isOnMapView ? (
                <UserGivenTitleOnMap userGivenTitle={requestTitle} />
              ) : (
                <UserGivenTitle userGivenTitle={requestTitle} />
              )}
              {isOnMapView ? (
                <SummaryStartDateAndTimeOnMap
                  date={startingDateAndTime}
                  renderHelpComponent={() => (
                    <CountDownComponent startingDate={startingDateAndTime} />
                  )}
                />
              ) : (
                <SummaryStartDateAndTime
                  date={startingDateAndTime}
                  renderHelpComponent={() => (
                    <CountDownComponent startingDate={startingDateAndTime} />
                  )}
                />
              )}
              {!isOnMapView && (
                <div className="group">
                  <CenteredUserImageAndRating
                    clipUserName
                    userDetails={_ownerRef}
                    clickable={false}
                  />
                </div>
              )}
              {!isOnMapView && (
                <div className="group">
                  <CardTitleAndActionsInfo
                    isOnMapView={isOnMapView}
                    requestState={state}
                    templateId={templateId}
                    bidsList={_bidsListRef}
                    userAlreadyView={userAlreadyView}
                    request={request}
                  />
                </div>
              )}

              {!isOnMapView && (
                <>
                  <br></br>
                  <div style={{ display: 'flex' }}>
                    <a
                      onClick={(e) => {
                        if (!isLoggedIn) {
                          switchRoute(ROUTES.CLIENT.TASKER.getDynamicBidOnRequestPage(request._id));
                        } else {
                          if (canBid) {
                            updateViewedBy(request);
                            switchRoute(
                              ROUTES.CLIENT.TASKER.getDynamicBidOnRequestPage(request._id),
                            );
                          } else {
                            const elmnt = document.querySelector('#bob-taskerVerificationBanner');

                            if (elmnt) {
                              elmnt.scrollIntoView({ block: 'end', behavior: 'smooth' });
                              return;
                            } else {
                              dispatch({
                                type: A.UI_ACTIONS.SHOW_TOAST_MSG,
                                payload: {
                                  toastDetails: {
                                    type: 'error',
                                    msg:
                                      'You are not verified yet, Try refreshing the page first. Otherwise please chat with our support team',
                                  },
                                },
                              });
                            }
                          }
                        }
                      }}
                      className="button is-success firstButtonInCard"
                    >
                      <span className="icon">
                        <i className="fas fa-hand-paper"></i>
                      </span>
                      <span>Bid Now</span>
                    </a>
                    {showMapView && (
                      <a
                        onClick={(e) => {
                          const markerRef = reactMapClusterRef;
                          markerRef.current.props.onClick();
                        }}
                        className="button secondButtonInCard"
                      >
                        <span className="icon">
                          <i className="fas fa-map-marker-alt"></i>
                        </span>
                        <span>Locate</span>
                      </a>
                    )}
                  </div>
                </>
              )}
              {isOnMapView && (
                <div>
                  <div style={{ display: 'inline-block', marginRight: 12, marginTop: -12 }}>
                    <a onClick={onCloseHandler} className="button is-small">
                      Close
                    </a>
                  </div>
                  <div style={{ display: 'inline-block', marginTop: -12 }}>
                    <a
                      onClick={(e) => {
                        if (!isLoggedIn || canBid) {
                          switchRoute(ROUTES.CLIENT.TASKER.getDynamicBidOnRequestPage(request._id));
                        } else {
                          if (isLoggedIn) {
                            updateViewedBy(request);
                          }

                          e.preventDefault();
                          const elmnt = document.querySelector('#bob-taskerVerificationBanner');
                          elmnt && elmnt.scrollIntoView({ block: 'end', behavior: 'smooth' });
                        }
                      }}
                      className="button is-success is-small"
                    >
                      Bid Now
                    </a>
                  </div>
                </div>
              )}
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
  };
};

export default connect(null, mapDispatchToProps)(TaskerBidOnTaskSummary);
