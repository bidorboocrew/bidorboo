import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { proposerConfirmsJobCompletion, cancelJobById } from '../../app-state/actions/jobActions';
import { showLoginDialog } from '../../app-state/actions/uiActions';

import { HOUSE_CLEANING_DEF } from './houseCleaningDefinition';
import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

import {
  AvgBidDisplayLabelAndValue,
  DisplayLabelValue,
  UserImageAndRating,
  CardTitleWithBidCount,
  StartDateAndTime,
} from '../../containers/commonComponents';

import RequestBaseContainer from '../RequestBaseContainer';

class TaskerHouseCleaningSummary extends RequestBaseContainer {
  render() {
    const { IMG_URL } = HOUSE_CLEANING_DEF;

    const { job, otherArgs, isLoggedIn, userDetails } = this.props;
    const { onCloseHandler = () => null, isOnMapView = false } = otherArgs;
    const { startingDateAndTime, fromTemplateId, _bidsListRef, _ownerRef, state, extras } = job;

    const currentUserId = userDetails && userDetails._id ? userDetails._id : '';
    const { userAlreadyBid, userExistingBid } = getUserExistingBid(job, currentUserId);
    const userAlreadyView = didUserAlreadyView(job, currentUserId);

    const effortLevel =
      extras && extras.effort ? (
        <DisplayLabelValue labelText="Effort" labelValue={extras.effort} />
      ) : (
        <DisplayLabelValue labelText="Effort" labelValue={'not specified'} />
      );

    return (
      <div className={`card is-clipped ${isOnMapView ? 'bdb-infoBoxCard' : 'limitWidthOfCard'}`}>
        {!isOnMapView && (
          <div className="card-image is-clipped">
            <img className="bdb-cover-img" src={IMG_URL} />
          </div>
        )}
        <div className="card-content">
          <div className="content">
            <CardTitleWithBidCount
              userAlreadyBid={userAlreadyBid}
              jobState={state}
              fromTemplateId={fromTemplateId}
              bidsList={_bidsListRef}
              userAlreadyView={userAlreadyView}
            />
            <br />
            <label className="label">Requester:</label>
            <UserImageAndRating userDetails={_ownerRef} />
            <StartDateAndTime date={startingDateAndTime} />
            {!isOnMapView && effortLevel}
            {!isOnMapView && <AvgBidDisplayLabelAndValue bidsList={_bidsListRef} />}
          </div>
          {!isOnMapView && (
            <React.Fragment>
              {userAlreadyBid ? (
                <a
                  onClick={(e) => {
                    debugger;
                    e.preventDefault();
                    switchRoute(
                      ROUTES.CLIENT.BIDDER.dynamicReviewMyBidAndTheRequestDetails(
                        userExistingBid._id,
                      ),
                    );
                  }}
                  className="button  is-outlined is-fullwidth"
                >
                  View Your existing Bid
                </a>
              ) : (
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    debugger;
                    if (!isLoggedIn) {
                      showLoginDialog(true);
                    } else {
                      switchRoute(ROUTES.CLIENT.BIDDER.getDynamicBidOnJobPage(job._id));
                    }
                  }}
                  className="button is-success is-outlined is-fullwidth"
                >
                  Bid Now!
                </a>
              )}
            </React.Fragment>
          )}
          {isOnMapView && (
            <React.Fragment>
              {userAlreadyBid ? (
                <a className="button  is-outlined is-small is-fullwidth">View Your existing Bid</a>
              ) : (
                <a
                  style={{ marginTop: 10 }}
                  onClick={(e) => {
                    e.preventDefault();
                    if (!isLoggedIn) {
                      showLoginDialog(true);
                    } else {
                      switchRoute(ROUTES.CLIENT.BIDDER.getDynamicBidOnJobPage(job._id));
                    }
                  }}
                  className="button is-success is-small is-outlined is-fullwidth"
                >
                  Bid Now!
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
)(TaskerHouseCleaningSummary);

const getUserExistingBid = (job, currentUserId) => {
  if (!job._bidsListRef || !job._bidsListRef.length > 0) {
    return false;
  }

  let userExistingBid = null;
  let userAlreadyBid = job._bidsListRef.some((bid) => {
    userExistingBid = bid;
    return bid._bidderRef === currentUserId;
  });
  return { userAlreadyBid, userExistingBid };
};

const didUserAlreadyView = (job, currentUserId) => {
  if (!job.viewedBy || !job.viewedBy.length > 0) {
    return false;
  }

  let didUserAlreadyView = job.viewedBy.some((usrId) => {
    return usrId === currentUserId;
  });
  return didUserAlreadyView;
};
