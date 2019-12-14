import React from 'react';
import ReactDOM from 'react-dom';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
import TASKS_DEFINITIONS from '../tasksDefinitions';

import {
  SummaryStartDateAndTime,
  CardTitleAndActionsInfo,
  JobCardTitle,
  CountDownComponent,
  TaskImagesCarousel,
  CenteredUserImageAndRating,
  UserGivenTitle,
} from '../../containers/commonComponents';

import { getUserExistingBid, didUserAlreadyView } from '../../containers/commonUtils';

import RequestBaseContainer from './RequestBaseContainer';

export default class TaskerBidOnTaskSummary extends RequestBaseContainer {
  toggleRegisterAsTasker = () => {
    this.setState({ showRegisterAsTaskerModal: !this.state.showRegisterAsTaskerModal });
  };

  render() {
    const { job, otherArgs = {} } = this.props;
    const { showRegisterAsTaskerModal } = this.state;
    const { showMapView, isLoggedIn, userDetails, updateViewedBy } = otherArgs;
    if (!job || !job._id || !otherArgs || isLoggedIn === 'undefined' || !userDetails) {
      return <div>TaskerBidOnTaskSummary is missing properties</div>;
    }

    const { _id: currentUserId } = userDetails;
    if (!currentUserId) {
      return <div>TaskerBidOnTaskSummary is missing properties</div>;
    }

    const { onCloseHandler = () => null, isOnMapView = false } = otherArgs;
    if (!onCloseHandler || isOnMapView === 'undefined') {
      return <div>TaskerBidOnTaskSummary is missing properties</div>;
    }

    const {
      reactMapClusterRef,
      startingDateAndTime,
      templateId,
      _bidsListRef,
      _ownerRef,
      state,
      extras,
      taskImages = [],
      jobTitle,
    } = job;
    if (!startingDateAndTime || !templateId || !_ownerRef || !state || !extras) {
      return <div>TaskerBidOnTaskSummary is missing properties</div>;
    }

    const { TITLE, ID, ICON, IMG } = TASKS_DEFINITIONS[`${job.templateId}`];
    if (!TITLE || !ID) {
      return switchRoute(ROUTES.CLIENT.BIDDER.root);
    }

    const { userAlreadyBid, userExistingBid } = getUserExistingBid(job, currentUserId);
    const userAlreadyView = didUserAlreadyView(job, currentUserId);

    const specialStyle = isOnMapView ? { padding: '0.25rem' } : {};
    const specialStyleCard = isOnMapView ? { width: 300 } : {};

    return (
      <React.Fragment>
        <div style={{ ...specialStyleCard }} className="card has-text-centered cardWithButton">
          <div style={{ ...specialStyle }} className="card-content">
            <div className="content">
              <JobCardTitle icon={ICON} title={TITLE} img={IMG} />
              <UserGivenTitle userGivenTitle={jobTitle} />

              {!isOnMapView && <TaskImagesCarousel taskImages={taskImages} />}

              <SummaryStartDateAndTime
                date={startingDateAndTime}
                renderHelpComponent={() => (
                  <CountDownComponent startingDate={startingDateAndTime} isJobStart={false} />
                )}
              />
              <div className="group">
                <label className="label hasSelectedValue">Requester</label>
                {!isOnMapView && (
                  <CenteredUserImageAndRating clipUserName userDetails={_ownerRef} />
                )}
              </div>
              {!isOnMapView && (
                <div className="group">
                  {/* <label className="label">Task Info</label> */}
                  <CardTitleAndActionsInfo
                    isOnMapView={isOnMapView}
                    userAlreadyBid={userAlreadyBid}
                    jobState={state}
                    templateId={templateId}
                    bidsList={_bidsListRef}
                    userAlreadyView={userAlreadyView}
                    job={job}
                  />
                </div>
              )}
              <br></br>
              {!isOnMapView && (
                <div style={{ display: 'flex' }}>
                  <a
                    style={{ flexGrow: 1 }}
                    onClick={(e) => {
                      switchRoute(ROUTES.CLIENT.BIDDER.getDynamicBidOnJobPage(job._id));
                    }}
                    className="button is-success firstButtonInCard"
                  >
                    Place Your Bid
                  </a>

                  {showMapView && (
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
                      className="button secondButtonInCard "
                    >
                      <span className="icon">
                        <i className="fas fa-map-marked-alt" />
                      </span>
                    </a>
                  )}
                </div>
              )}
              {isOnMapView && (
                <div>
                  <div style={{ display: 'inline-block', marginRight: 12 }}>
                    <a
                      style={{ marginTop: 10 }}
                      onClick={onCloseHandler}
                      className="button is-small"
                    >
                      Close
                    </a>
                  </div>
                  <div style={{ display: 'inline-block' }}>
                    <a
                      onClick={(e) => {
                        if (isLoggedIn) {
                          updateViewedBy(job);
                        }
                        switchRoute(ROUTES.CLIENT.BIDDER.getDynamicBidOnJobPage(job._id));
                      }}
                      className="button is-success is-small"
                    >
                      Place Your Bid
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {showRegisterAsTaskerModal && (
          <ShowRegisterAsTaskerModal handleClose={this.toggleRegisterAsTasker} />
        )}
      </React.Fragment>
    );
  }
}

const ShowRegisterAsTaskerModal = ({ handleClose }) => {
  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <div className="modal is-active">
          <div onClick={handleClose} className="modal-background" />
          <div className="modal-card">
            <header className="modal-card-head">
              <div className="modal-card-title">Setup your payout info</div>
            </header>
            <section className="modal-card-body">
              <div className="group">
                <label className="label">In order to bid on jobs you must :</label>
              </div>
              <ul>
                <li>- Be at least 19 years of old</li>
                <li>
                  <a onClick={() => switchRoute(ROUTES.CLIENT.MY_PROFILE.basicSettings)}>
                    - Verify your email and phone info
                  </a>
                </li>
                <li>
                  <a onClick={() => switchRoute(ROUTES.CLIENT.MY_PROFILE.paymentSettings)}>
                    - Setup your banking payout details
                  </a>
                </li>
              </ul>
            </section>
            <footer className="modal-card-foot">
              <button onClick={handleClose} className="button is-outline">
                Close
              </button>
              <button
                onClick={() => switchRoute(ROUTES.CLIENT.MY_PROFILE.basicSettings)}
                className="button is-success"
              >
                go to my profile
              </button>
            </footer>
          </div>
        </div>,
        document.querySelector('#bidorboo-root-modals'),
      )}
    </React.Fragment>
  );
};
