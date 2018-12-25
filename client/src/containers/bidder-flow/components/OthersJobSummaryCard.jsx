import React from 'react';
import moment from 'moment';

// import { switchRoute } from '../../../utils';
// import * as ROUTES from '../../../constants/frontend-route-consts';

import { templatesRepo } from '../../../constants/bidOrBooTaskRepo';
import { DisplayLabelValue, CountDownComponent } from './commonComponents';

export default class OthersJobSummaryCard extends React.Component {
  render() {
    const { job, userDetails, isLoggedIn } = this.props;
    const {
      startingDateAndTime,
      createdAt,
      fromTemplateId,
      _bidsListRef,
      viewedBy,
      _ownerRef,
    } = job;

    // in case we cant find the job
    if (!templatesRepo[fromTemplateId]) {
      return null;
    }
    let temp = _ownerRef
      ? _ownerRef
      : { profileImage: { url: '' }, displayName: '', rating: { globalRating: 'No Ratings Yet' } };

    const { profileImage, displayName, rating } = temp;

    let daysSinceCreated = '';
    try {
      daysSinceCreated = createdAt
        ? moment.duration(moment().diff(moment(createdAt))).humanize()
        : 0;
    } catch (e) {
      //xxx we dont wana fail simply cuz we did not get the diff in time
      console.error(e);
    }
    const currentUserId = userDetails && userDetails._id ? userDetails._id : '';
    const areThereAnyBidders = _bidsListRef && _bidsListRef.length > 0;
    return (
      <div className="card bidderRootSpecial is-clipped">
        <header
          style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
          className="card-header is-clipped"
        >
          <p className="card-header-title">{templatesRepo[fromTemplateId].title}</p>

          <a className="card-header-icon">
            <span className={`${areThereAnyBidders ? 'has-text-success' : 'has-text-grey'}`}>
              <i style={{ marginRight: 2 }} className="fas fa-hand-paper" />
              {`${_bidsListRef ? _bidsListRef.length : 0} bids`}
            </span>
          </a>
        </header>
        <div className="card-image is-clipped">
          <img className="bdb-cover-img" src={`${templatesRepo[fromTemplateId].imageUrl}`} />
        </div>
        <div
          style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem', position: 'relative' }}
          className="card-content"
        >
          <div className="has-text-dark is-size-7">Owner:</div>

          <div className="media">
            <div className="media-left">
              <figure className="image is-48x48">
                <img src={profileImage.url} alt="Placeholder image" />
              </figure>
            </div>
            <div className="media-content">
              <p className="is-size-6">{displayName}</p>
              <p className="is-size-7">{rating.globalRating}</p>
            </div>
          </div>
          <div className="content">
            <DisplayLabelValue
              labelText="Start Date:"
              labelValue={
                startingDateAndTime && ` ${moment(startingDateAndTime.date).format('MMMM Do YYYY')}`
              }
            />

            <DisplayLabelValue
              labelText="Viewed:"
              labelValue={`${viewedBy ? viewedBy.length : 0} times`}
            />

            <p className="is-size-7">
              <span style={{ fontSize: '10px', color: 'grey' }}>
                {`Posted (${daysSinceCreated} ago)`}
              </span>
            </p>
          </div>
        </div>
        {associatedUserActions(job, currentUserId)}
        <br />
        <CountDownComponent
          startingDate={startingDateAndTime.date}
          render={({ days, hours, minutes, seconds }) => {
            return (
              <React.Fragment>
                {days && !`${days}`.includes('NaN') ? (
                  <div className="has-text-white">{`expires in ${days} days ${hours}h ${minutes}m ${seconds}s`}</div>
                ) : null}
              </React.Fragment>
            );
          }}
        />
      </div>
    );
  }
}


const associatedUserActions = (job, currentUserId) => {
  let viewed = didUserAlreadyView(job, currentUserId);
  let bid = didUserAlreadyBid(job, currentUserId);
  // let booed = didUserAlreadyBoo(job, currentUserId);

  return viewed || bid ? (
    <footer className="card-footer">
      <div style={{ padding: 10 }} className="tags are-medium">
        <div className="has-text-grey tag is-white">You: </div>
        {viewed && <div className="tag is-light">Viewed</div>}
        {bid && <div className="tag is-success">Bid</div>}
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

const didUserAlreadyBoo = (job, currentUserId) => {
  if (!job.booedBy || !job.booedBy.length > 0) {
    return false;
  }

  let didUserAlreadyBoo = job.booedBy.some((usrId) => {
    return usrId === currentUserId;
  });
  return didUserAlreadyBoo;
};
