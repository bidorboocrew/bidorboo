import React from 'react';
import Countdown from 'react-countdown-now';
import ReactStars from 'react-stars';

import moment from 'moment';

import { templatesRepo } from '../constants/bidOrBooTaskRepo';

export const getDaysSinceCreated = (createdAt) => {
  let daysSinceCreated = '';
  try {
    daysSinceCreated = createdAt ? moment.duration(moment().diff(moment(createdAt))).humanize() : 0;
  } catch (e) {
    //xxx we dont wana fail simply cuz we did not get the diff in time
    console.error(e);
  }
  return daysSinceCreated;
};

export const findAvgBidInBidList = (bidsList) => {
  let hasBids = bidsList && bidsList.length > 0;

  if (hasBids) {
    const bidsTotal = bidsList
      .map((bid) => bid.bidAmount.value)
      .reduce((accumulator, bidAmount) => accumulator + bidAmount);
    return Math.ceil(bidsTotal / bidsList.length);
  }
  return null;
};

export const AvgBidDisplayLabelAndValue = ({ bidsList }) => {
  let minBid = findAvgBidInBidList(bidsList);
  let avgBidLabel = minBid ? (
    <DisplayLabelValue labelText="Avg Bid:" labelValue={`${minBid} CAD`} />
  ) : (
    <DisplayLabelValue labelText="Avg Bid:" labelValue={`None yet!`} />
  );
  return avgBidLabel;
};

export const DisplayLabelValue = (props) => {
  return (
    <div>
      <div className="has-text-grey is-size-7">{props.labelText}</div>
      <div className="is-size-6 is-success">{props.labelValue}</div>
    </div>
  );
};

export const CountDownComponent = (props) => {
  const { startingDate, isJobStart = true } = props;

  return (
    <React.Fragment>
      <br />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          marginTop: 6,
          borderRadius: 4,
        }}
        className="is-size-7  has-text-centered"
      >
        <Countdown
          date={startingDate || new Date()}
          intervalDelay={1000}
          renderer={({ days, hours, minutes, seconds, completed }) => {
            return completed ? (
              <ExpiringSoon startingDate={startingDate} />
            ) : (
              <React.Fragment>
                {days && !`${days}`.includes('NaN') ? (
                  <div style={{ color: 'lightgrey' }}>{`${
                    isJobStart ? 'Starts' : 'Deadline'
                  } in ${days} days ${hours}h ${minutes}m ${seconds}s`}</div>
                ) : null}
              </React.Fragment>
            );
          }}
        />
      </div>
    </React.Fragment>
  );
};
const ExpiringSoon = ({ startingDate }) => {
  const today = moment()
    .startOf('day')
    .toISOString();

  const jobStartingDate = moment(startingDate).toISOString();

  if (moment(jobStartingDate).isBefore(today)) {
    return <div className="has-text-danger">Expired Already!</div>;
  } else {
    return <div className="has-text-warning">Expiring Soon!</div>;
  }
};

export const UserImageAndRating = ({ userDetails }) => {
  let temp = userDetails
    ? userDetails
    : { profileImage: { url: '' }, displayName: 'no user', rating: { globalRating: 'no user' } };

  const { profileImage, displayName, rating } = temp;
  return (
    <div className="media">
      <div className="media-left">
        <figure className="image is-48x48">
          <img src={profileImage.url} alt="Placeholder image" />
        </figure>
      </div>
      <div className="media-content">
        <p className="is-size-6">{displayName}</p>
        {rating.globalRating === 'No Ratings Yet' || rating.globalRating === 0 ? (
          <p className="is-size-7">'No Ratings Yet' </p>
        ) : (
          <ReactStars
            className="is-size-7"
            half
            count={5}
            value={rating.globalRating}
            edit={false}
            size={20}
            color1={'lightgrey'}
            color2={'#ffd700'}
          />
        )}
      </div>
    </div>
  );
};

export const JobStats = ({ daysSinceCreated, viewedBy }) => {
  return null;
  return (
    <nav style={{ marginTop: 6 }} className="level is-mobile">
      <div className="level-left">
        <div className="level-item">
          <span style={{ fontSize: '10px', color: 'grey' }}>
            {`Posted (${daysSinceCreated} ago)`}
          </span>
        </div>
      </div>

      <div className="level-right">
        <p className="level-item">
          <span style={{ fontSize: '10px', color: 'grey' }}>
            {`Viewed by ${viewedBy ? viewedBy.length : 0} bidders`}
          </span>
        </p>
      </div>
    </nav>
  );
};

export const CardTitleWithBidCount = ({ jobState, fromTemplateId, bidsList, userAlreadyView }) => {
  const areThereAnyBidders = bidsList && bidsList.length > 0;
  const bidsCountLabel = `${bidsList ? bidsList.length : 0} bids`;
  const isAwarded = `${jobState ? jobState : ''}` && `${jobState}`.toLowerCase() === 'awarded';
  return (
    <header
      style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
      className="card-header is-clipped"
    >
      <p className="card-header-title">{templatesRepo[fromTemplateId].title}</p>

      <a className="card-header-icon">
        {userAlreadyView && (
          <span style={{ marginRight: 4 }} className="has-text-grey">
            <span className="icon">
              <i className="far fa-eye" />
            </span>
          </span>
        )}
        {!isAwarded && (
          <span className={`${areThereAnyBidders ? 'has-text-success' : 'has-text-grey'}`}>
            <span className="icon">
              <i className="fas fa-hand-paper" />
            </span>
            <span>{bidsCountLabel}</span>
          </span>
        )}
        {isAwarded && <span className={'has-text-info has-text-weight-bold'}>Awarded</span>}
      </a>
    </header>
  );
};
