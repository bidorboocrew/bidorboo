import React from 'react';
import ReactDOM from 'react-dom';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
import TASKS_DEFINITIONS from '../tasksDefinitions';

import {
  SummaryStartDateAndTime,
  CardTitleAndActionsInfo,
  RequestCardTitle,
  CountDownComponent,
  TaskImagesCarousel,
  CenteredUserImageAndRating,
  UserGivenTitle,
} from '../../containers/commonComponents';

import { didUserAlreadyView } from '../../containers/commonUtils';

import RequestBaseContainer from './RequestBaseContainer';

export default class TaskerBidOnTaskSummary extends RequestBaseContainer {
  render() {
    const { request, otherArgs = {} } = this.props;
    // const { showRegisterAsTaskerModal } = this.state;
    const { showMapView, isLoggedIn, userDetails, updateViewedBy } = otherArgs;

    const { _id: currentUserId } = userDetails;

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

    const specialStyle = isOnMapView ? { padding: '0.25rem' } : {};
    const specialStyleCard = isOnMapView ? { width: 300 } : {};

    return (
      <React.Fragment>
        <div style={{ ...specialStyleCard }} className="card has-text-centered cardWithButton">
          <div style={{ ...specialStyle }} className="card-content">
            <div className="content">
              <RequestCardTitle icon={ICON} title={TITLE} img={IMG} />
              <UserGivenTitle userGivenTitle={requestTitle} />

              {!isOnMapView && <TaskImagesCarousel taskImages={taskImages} />}

              <SummaryStartDateAndTime
                date={startingDateAndTime}
                renderHelpComponent={() => (
                  <CountDownComponent startingDate={startingDateAndTime} />
                )}
              />
              <div className="group">
                {!isOnMapView && (
                  <CenteredUserImageAndRating
                    labelOnTop={() => <label className="label hasSelectedValue">Requester</label>}
                    clipUserName
                    userDetails={_ownerRef}
                  />
                )}
              </div>
              {!isOnMapView && (
                <div className="group">
                  {/* <label className="label">Task Info</label> */}
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
                      style={{ flexGrow: 1 }}
                      onClick={(e) => {
                        switchRoute(ROUTES.CLIENT.TASKER.getDynamicBidOnRequestPage(request._id));
                      }}
                      className="button is-success firstButtonInCard"
                    >
                      Enter Your Bid
                    </a>
                    {showMapView && (
                      <a
                        style={{ marginLeft: 12 }}
                        onClick={(e) => {
                          const markerRef = reactMapClusterRef;
                          markerRef.current.props.onClick();
                        }}
                        className="button secondButtonInCard "
                      >
                        <span className="icon">
                          <i className="fas fa-map-marked-alt" />
                        </span>
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
                      onClick={() => {
                        if (isLoggedIn) {
                          updateViewedBy(request);
                        }
                        switchRoute(ROUTES.CLIENT.TASKER.getDynamicBidOnRequestPage(request._id));
                      }}
                      className="button is-success is-small"
                    >
                      Enter Your Bid
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
