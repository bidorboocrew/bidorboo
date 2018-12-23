import React from 'react';
import moment from 'moment';
import Countdown from 'react-countdown-now';
import TextareaAutosize from 'react-autosize-textarea';

import { templatesRepo } from '../../../constants/bidOrBooTaskRepo';

export default class JobFullDetailsCard extends React.Component {
  render() {
    const { job } = this.props;
    const {
      startingDateAndTime,
      _bidsListRef,
      _ownerRef,
      state,
      viewedBy,
      booedBy,
      detailedDescription,
      location,
      addressText,
      durationOfJob,
      fromTemplateId,
      reportThisJob,
      createdAt,
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
            <p className="is-size-7">
              {startingDateAndTime &&
                `Start Date ${moment(startingDateAndTime.date).format('MMMM Do YYYY')}`}
            </p>

            <p className="is-size-7">{`Biders:  ${_bidsListRef.length}`}</p>
            <p className="is-size-7">{`viewed:  ${viewedBy.length} times`}</p>
            <p className="is-size-7">{`addressText:  ${addressText}`}</p>
            <p className="is-size-7">{`durationOfJob:  ${durationOfJob}`}</p>
            <p className="is-size-7">{`state:  ${state}`}</p>
            <p className="is-size-7">{`Booed:  ${booedBy.length} times`}</p>
            <p className="is-size-7">{`reported:  ${reportThisJob} times`}</p>
            <p className="is-size-7">
              <span>Detailed Description</span>
              <br />
              <span className="is-size-7">
                <TextareaAutosize
                  value={detailedDescription}
                  className="textarea is-marginless is-paddingless is-size-7"
                  style={{
                    resize: 'none',
                    border: 'none',
                    color: '#4a4a4a',
                  }}
                  readOnly
                />
              </span>
            </p>
            <p className="is-size-7">
              <span style={{ fontSize: '10px', color: 'grey' }}>
                {`Posted (${daysSinceCreated} ago)`}
              </span>
            </p>
          </div>
        </div>
        {countDownToStart({ startingDate: startingDateAndTime.date })}
      </div>
    );
  }
}

const countDownToStart = (props) => {
  const { startingDate } = props;
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
                  <div className="has-text-white">{`Job Starts in ${days} days ${hours}h ${minutes}m ${seconds}s`}</div>
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
