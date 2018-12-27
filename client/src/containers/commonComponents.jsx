import React from 'react';
import Countdown from 'react-countdown-now';
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
    const minBid = bidsList
      .map((bid) => bid.bidAmount.value)
      .reduce((accumulator, bidAmount) => accumulator + bidAmount);
    return minBid;
  }
  return null;
};

export const AvgBidDisplayLabelAndValue = ({ bidsList }) => {
  let minBid = findAvgBidInBidList(bidsList);
  let lowestBidLabel = minBid ? (
    <DisplayLabelValue labelText="Avg Bid:" labelValue={`${minBid} CAD`} />
  ) : null;
  return lowestBidLabel;
};

export const DisplayLabelValue = (props) => {
  return (
    <div>
      <div className="has-text-dark is-size-7">{props.labelText}</div>
      <div className="has-text-weight-bold is-size-6 is-primary">{props.labelValue}</div>
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
          background: 'lightgrey',
          marginTop: 6,
        }}
        className="is-size-7 has-text-white has-text-centered"
      >
        <Countdown
          date={startingDate || new Date()}
          intervalDelay={1000}
          renderer={({ days, hours, minutes, seconds, completed }) => {
            return completed ? (
              <Expired />
            ) : (
              <React.Fragment>
                {days && !`${days}`.includes('NaN') ? (
                  <div className="has-text-white">{`${
                    isJobStart ? 'Starts' : 'Expires'
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
const Expired = () => <div className="has-text-danger">Expired!</div>;

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
        <p className="is-size-7">{rating.globalRating}</p>
      </div>
    </div>
  );
};

export const JobStats = ({ daysSinceCreated, viewedBy }) => {
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
            {`Viewed ${viewedBy ? viewedBy.length : 0} times`}
          </span>
        </p>
      </div>
    </nav>
  );
};

export const CardTitleWithBidCount = ({ jobState, fromTemplateId, bidsList }) => {
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
