import React from 'react';
import ReactDOM from 'react-dom';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  proposerConfirmsJobCompletion,
  cancelJobById,
  updateViewedBy,
} from '../../app-state/actions/jobActions';
import { showLoginDialog } from '../../app-state/actions/uiActions';
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
} from '../../containers/commonComponents';

import { getUserExistingBid, didUserAlreadyView } from '../../containers/commonUtils';

import RequestBaseContainer from './RequestBaseContainer';

class TaskerBidOnTaskSummary extends RequestBaseContainer {
  toggleRegisterAsTasker = () => {
    this.setState({ showRegisterAsTaskerModal: !this.state.showRegisterAsTaskerModal });
  };

  render() {
    const {
      job,
      otherArgs = {},
      isLoggedIn,
      userDetails,
      showLoginDialog,
      updateViewedBy,
    } = this.props;
    const { showRegisterAsTaskerModal } = this.state;
    const { showMapView } = otherArgs;
    if (
      !job ||
      !job._id ||
      !otherArgs ||
      isLoggedIn === 'undefined' ||
      !userDetails ||
      !showLoginDialog
    ) {
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
              <TaskImagesCarousel taskImages={taskImages} />
              <SummaryStartDateAndTime
                date={startingDateAndTime}
                renderHelpComponent={() => (
                  <CountDownComponent startingDate={startingDateAndTime} isJobStart={false} />
                )}
              />
              {!isOnMapView && (
                <CenteredUserImageAndRating
                  clipUserName
                  userDetails={_ownerRef}
                  isCentered={false}
                />
              )}
              {!isOnMapView && (
                <div className="group">
                  <label className="label">Task Info</label>
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
              {!isOnMapView && (
                <React.Fragment>
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
                        className="button is-dark firstButtonInCard"
                      >
                        View My Bid
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
                          className="button is-info secondButtonInCard "
                        >
                          <span className="icon">
                            <i className="fas fa-map-marked-alt" />
                          </span>
                          <span>Locate</span>
                        </a>
                      )}
                    </div>
                  ) : (
                    <div style={{ display: 'flex' }}>
                      <a
                        style={{ flexGrow: 1 }}
                        onClick={(e) => {
                          if (!isLoggedIn) {
                            showLoginDialog(true);
                            return;
                          }
                          // else if (!userDetails.canBid) {
                          //   // xxxxxxxxxxx re enable this very important
                          //   // this.toggleRegisterAsTasker();
                          // }

                          // else if (userDetails.canBid) {
                          else {
                            updateViewedBy(job);
                            switchRoute(ROUTES.CLIENT.BIDDER.getDynamicBidOnJobPage(job._id));
                          }
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
                          className="button is-info secondButtonInCard "
                        >
                          <span className="icon">
                            <i className="fas fa-map-marked-alt" />
                          </span>
                          <span>Locate</span>
                        </a>
                      )}
                    </div>
                  )}
                </React.Fragment>
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
                        className="button is-small is-fullwidth"
                      >
                        View My existing Bid
                      </a>
                    ) : (
                      <a
                        style={{ marginTop: 10 }}
                        onClick={(e) => {
                          if (!isLoggedIn) {
                            showLoginDialog(true);
                            return;
                          }
                          //  else if (!userDetails.canBid) {
                          //   xxxxxxxxxxxxxxxxxxxx reenable
                          //   this.toggleRegisterAsTasker();
                          // }
                          // else if (userDetails.canBid) {
                          else {
                            updateViewedBy(job);
                            switchRoute(ROUTES.CLIENT.BIDDER.getDynamicBidOnJobPage(job._id));
                          }
                        }}
                        className="button is-success is-small"
                      >
                        Place Your Bid
                      </a>
                    )}
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
    updateViewedBy: bindActionCreators(updateViewedBy, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TaskerBidOnTaskSummary);

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
                <li>- Be at least 16 years of old</li>
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

// <div
//           className={`card cardWithButton ${isOnMapView ? 'bdb-infoBoxCard' : 'limitWidthOfCard'}`}
//         >
//           <div className="card-content">
//             <div className="content">
// <CardTitleAndActionsInfo
//   isOnMapView={isOnMapView}
//   userAlreadyBid={userAlreadyBid}
//   jobState={state}
//   templateId={templateId}
//   bidsList={_bidsListRef}
//   userAlreadyView={userAlreadyView}
// />

//               <div className="group">
//                 <label className="label">Requester:</label>
//                 <UserImageAndRating clipUserName userDetails={_ownerRef} />
//               </div>
//               <StartDateAndTime
//                 date={startingDateAndTime}
//                 renderHelpComponent={() => (
//                   <CountDownComponent startingDate={startingDateAndTime} />
//                 )}
//               />
//               {/* {!isOnMapView && <TaskSpecificExtras templateId={ID} extras={extras} />} */}
//               {!isOnMapView && <AvgBidDisplayLabelAndValue bidsList={_bidsListRef} />}
//             </div>

//           </div>
//         </div>
