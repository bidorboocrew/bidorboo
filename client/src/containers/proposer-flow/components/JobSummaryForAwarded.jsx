import React from 'react';
import moment from 'moment';

import { switchRoute } from '../../../utils';
import * as ROUTES from '../../../constants/frontend-route-consts';

import Countdown from 'react-countdown-now';

import { templatesRepo } from '../../../constants/bidOrBooTaskRepo';

export default class JobSummaryForAwarded extends React.Component {
  render() {
    const { job } = this.props;
    const { startingDateAndTime, createdAt, fromTemplateId } = job;

    // in case we cant find the job
    if (!templatesRepo[fromTemplateId]) {
      return null;
    }

    const { _awardedBidRef } = job;
    const { bidAmount, _bidderRef } = _awardedBidRef;

    let temp = _bidderRef
      ? _bidderRef
      : {
          profileImage: { url: '' },
          displayName: '',
          rating: { globalRating: 'No Ratings Yet' },
        };

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

    return (
      <div className="card bidderRootSpecial is-clipped">
        <header
          style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
          className="card-header is-clipped"
        >
          <p className="card-header-title">{templatesRepo[fromTemplateId].title}</p>
        </header>

        <div className="card-image is-clipped">
          <img className="bdb-cover-img" src={`${templatesRepo[fromTemplateId].imageUrl}`} />
        </div>
        <div
          style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem', position: 'relative' }}
          className="card-content"
        >
          <div className="content">
            <DisplayLabelValue
              labelText="Bid Amount:"
              labelValue={bidAmount && ` ${bidAmount.value} ${bidAmount.currency}`}
            />

            <DisplayLabelValue labelText="Awarded Bidder Name:" labelValue={displayName} />
            <DisplayLabelValue
              labelText="Awarded Bidder Rating:"
              labelValue={rating.globalRating}
            />
            <DisplayLabelValue
              labelText="Job Start Date:"
              labelValue={
                startingDateAndTime && ` ${moment(startingDateAndTime.date).format('MMMM Do YYYY')}`
              }
            />
          </div>
        </div>
        {renderFooter({ job })}
        <br />
        {countDownToStart({ startingDate: startingDateAndTime.date })}
      </div>
    );
  }
}

const Expired = () => <div className="has-text-danger">Expired!</div>;

const countDownToStart = (props) => {
  const { startingDate } = props;
  return (
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
                <div className="has-text-white">{`Starts in ${days} days ${hours}h ${minutes}m ${seconds}s`}</div>
              ) : null}
            </React.Fragment>
          );
        }}
      />
    </div>
  );
};
let renderFooter = ({ job }) => (
  <footer className="card-footer">
    <div className="card-footer-item">
      <a
        className="button is-success is-fullwidth "
        onClick={(e) => {
          e.preventDefault();
          switchRoute(`${ROUTES.CLIENT.PROPOSER.selectedAwardedJobPage}/${job._id}`);
        }}
      >
        <span style={{ marginLeft: 4 }}>
          <i className="fa fa-hand-paper" /> Contact
        </span>
      </a>
    </div>
  </footer>
);

const DisplayLabelValue = (props) => {
  return (
    <div>
      <div className="has-text-dark is-size-7">{props.labelText}</div>
      <div className="has-text-weight-bold is-size-6 is-primary">{props.labelValue}</div>
    </div>
  );
};
