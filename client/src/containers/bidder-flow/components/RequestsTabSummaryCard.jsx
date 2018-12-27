import React from 'react';
import moment from 'moment';

import { templatesRepo } from '../../../constants/bidOrBooTaskRepo';
import {
  AvgBidDisplayLabelAndValue,
  DisplayLabelValue,
  CountDownComponent,
  UserImageAndRating,
  JobStats,
  CardTitleWithBidCount,
  getDaysSinceCreated,
} from '../../commonComponents';

export default class RequestsTabSummaryCard extends React.Component {
  render() {
    const {
      job,
      userDetails,
      showCoverImg = true,
      cardSpecialClass = 'bidderRootSpecial',
      onClickHandler = () => null,
      onCloseHandler = () => null,
      withButtons = false,
    } = this.props;
    const {
      startingDateAndTime,
      createdAt,
      fromTemplateId,
      _bidsListRef,
      viewedBy,
      _ownerRef,
      state,
    } = job;

    let daysSinceCreated = getDaysSinceCreated(createdAt);
    let isAwarded = state && state.toLowerCase() === 'awarded';

    const currentUserId = userDetails && userDetails._id ? userDetails._id : '';
    return (
      <div
        onClick={(e) => {
          e.preventDefault();
          if (!withButtons) {
            !isAwarded && onClickHandler();
          }
        }}
        className={`card is-clipped ${cardSpecialClass} ${isAwarded ? 'disabled' : ''}`}
      >
        <CardTitleWithBidCount
          jobState={state}
          fromTemplateId={fromTemplateId}
          bidsList={_bidsListRef}
        />
        {showCoverImg && (
          <div className="card-image is-clipped">
            <img className="bdb-cover-img" src={`${templatesRepo[fromTemplateId].imageUrl}`} />
          </div>
        )}
        <div
          style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem', position: 'relative' }}
          className="card-content"
        >
          <div className="has-text-dark is-size-7">Requester:</div>
          <UserImageAndRating userDetails={_ownerRef} />

          <div className="content">
            <DisplayLabelValue
              labelText="Start Date:"
              labelValue={
                startingDateAndTime && ` ${moment(startingDateAndTime.date).format('MMMM Do YYYY')}`
              }
            />
            <AvgBidDisplayLabelAndValue bidsList={_bidsListRef} />
            <JobStats daysSinceCreated={daysSinceCreated} viewedBy={viewedBy} />
          </div>
        </div>
        {withButtons && (
          <footer className="card-footer">
            <div className="card-footer-item">
              <a onClick={onClickHandler} className="button is-success is-fullwidth is-small">
                View
              </a>
            </div>
            <div className="card-footer-item">
              <a onClick={onCloseHandler} className="button is-outlined is-fullwidth is-small">
                Close
              </a>
            </div>
          </footer>
        )}

        {associatedUserActions(job, currentUserId)}

        {!withButtons && (
          <CountDownComponent startingDate={startingDateAndTime.date} isJobStart={false} />
        )}
      </div>
    );
  }
}

const associatedUserActions = (job, currentUserId) => {
  let viewed = didUserAlreadyView(job, currentUserId);
  let bid = didUserAlreadyBid(job, currentUserId);
  // let booed = didUserAlreadyBoo(job, currentUserId);

  return viewed ? (
    <footer className="card-footer">
      <div style={{ padding: 10 }} className="tags are-medium">
        <div className="has-text-grey tag is-white">You: </div>
        {viewed && <div className="tag is-light">Viewed</div>}
        {bid && (
          <div className="tag is-light">
            <span className="has-text-success">Bid</span>
          </div>
        )}
        {/* {booed && !didUserAlreadyBid && <div className="tag is-danger">Booed</div>} */}
      </div>
    </footer>
  ) : null;
};

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

// const didUserAlreadyBoo = (job, currentUserId) => {
//   if (!job.booedBy || !job.booedBy.length > 0) {
//     return false;
//   }

//   let didUserAlreadyBoo = job.booedBy.some((usrId) => {
//     return usrId === currentUserId;
//   });
//   return didUserAlreadyBoo;
// };
