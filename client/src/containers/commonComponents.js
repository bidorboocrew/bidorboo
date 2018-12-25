import React from 'react';
import Countdown from 'react-countdown-now';
import { templatesRepo } from '../constants/bidOrBooTaskRepo';

export const findMinBidInBidsList = (bidsList) => {
  let hasBids = bidsList && bidsList.length > 0;

  if (hasBids) {
    const minBid = bidsList
      .map((bid) => bid.bidAmount.value)
      .reduce((min, bidAmount) => Math.min(min, bidAmount));
    return minBid;
  }
  return null;
};

export const MinBidDisplayLabelValue = ({ bidsList }) => {
  let minBid = findMinBidInBidsList(bidsList);
  let lowestBidLabel = minBid ? (
    <div className="has-text-success">
      <DisplayLabelValue labelText="Min Bid:" labelValue={`${minBid} CAD`} />
    </div>
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
  const { startingDate, render, isJobStart = true } = props;
  return (
    <React.Fragment>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          background: 'lightgrey',
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
    <nav style={{ marginTop: 6 }} className="level">
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

export const CardTitleWithBidCount = ({ fromTemplateId, bidsList }) => {
  const areThereAnyBidders = bidsList && bidsList.length > 0;
  const bidsCountLabel = `${bidsList ? bidsList.length : 0} bids`;
  return (
    <header
      style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
      className="card-header is-clipped"
    >
      <p className="card-header-title">{templatesRepo[fromTemplateId].title}</p>

      <a className="card-header-icon">
        <span className={`${areThereAnyBidders ? 'has-text-success' : 'has-text-grey'}`}>
          <i style={{ marginRight: 2 }} className="fas fa-hand-paper" />
          {bidsCountLabel}
        </span>
      </a>
    </header>
  );
};
