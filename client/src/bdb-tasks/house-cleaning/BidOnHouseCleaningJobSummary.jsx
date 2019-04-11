import React from 'react';
import { HOUSE_CLEANING_DEF } from './houseCleaningDefinition';

import {
  AvgBidDisplayLabelAndValue,
  UserImageAndRating,
  CardTitleWithBidCount,
  StartDateAndTime,
} from '../../containers/commonComponents';

export default class RequestsTabSummaryCard extends React.Component {
  render() {
    const {
      job,
      userDetails,
      showCoverImg = true,
      cardSpecialStyle = 'bidderRootSpecial',
      onClickHandler = () => null,
      onCloseHandler = () => null,
      withButtons = false,
    } = this.props;
    const { IMG_URL } = HOUSE_CLEANING_DEF;

    const { startingDateAndTime, fromTemplateId, _bidsListRef, _ownerRef, state } = job;

    let isAwarded = state && state.toLowerCase() === 'awarded';

    const currentUserId = userDetails && userDetails._id ? userDetails._id : '';

    const userAlreadyBid = didUserAlreadyBid(job, currentUserId);
    const userAlreadyView = didUserAlreadyView(job, currentUserId);

    return (
      <div
        onClick={(e) => {
          e.preventDefault();
          if (!withButtons && !isAwarded && !userAlreadyBid) {
            onClickHandler();
          }
        }}
        className={`card is-clipped ${cardSpecialStyle} ${isAwarded ? 'disabled' : ''}`}
      >
        <CardTitleWithBidCount
          userAlreadyBid={userAlreadyBid}
          jobState={state}
          fromTemplateId={fromTemplateId}
          bidsList={_bidsListRef}
          userAlreadyView={userAlreadyView}
        />
        {showCoverImg && (
          <div className="card-image is-clipped">
            <img className="bdb-cover-img" src={IMG_URL} />
          </div>
        )}
        <div
          style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem', position: 'relative' }}
          className="card-content"
        >
          <div className="has-text-dark is-size-7">Requester:</div>
          <UserImageAndRating userDetails={_ownerRef} />

          <div className="content">
            <StartDateAndTime date={startingDateAndTime} />

            <AvgBidDisplayLabelAndValue bidsList={_bidsListRef} />
          </div>
          {!withButtons && (
            <React.Fragment>
              {userAlreadyBid ? (
                <a className="button  is-outlined is-fullwidth">You Already Bid</a>
              ) : (
                <a className="button is-success is-outlined is-fullwidth">Add Your Bid</a>
              )}
            </React.Fragment>
          )}
          {withButtons && (
            <React.Fragment>
              {userAlreadyBid ? (
                <a className="button  is-outlined is-small is-fullwidth">You Already Bid</a>
              ) : (
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    if (!isAwarded && !userAlreadyBid) {
                      onClickHandler();
                    }
                  }}
                  className="button is-success is-outlined is-small is-fullwidth"
                >
                  Add Your Bid
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

const didUserAlreadyBid = (job, currentUserId) => {
  if (!job._bidsListRef || !job._bidsListRef.length > 0) {
    return false;
  }

  let didUserAlreadyBid = job._bidsListRef.some((bid) => {
    return bid._bidderRef === currentUserId;
  });
  return didUserAlreadyBid;
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
