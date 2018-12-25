import React from 'react';
import moment from 'moment';
import TextareaAutosize from 'react-autosize-textarea';

import { templatesRepo } from '../../../constants/bidOrBooTaskRepo';
import { DisplayLabelValue, CountDownComponent } from './commonComponents';

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
      addressText,
      durationOfJob,
      fromTemplateId,
      reported,
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
      console.error(e);
    }

    return (
      <div className="card bidderRootSpecial is-clipped disabled">
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
            <DisplayLabelValue
              labelText="Start Date:"
              labelValue={
                startingDateAndTime && ` ${moment(startingDateAndTime.date).format('MMMM Do YYYY')}`
              }
            />
            <DisplayLabelValue labelText="Address:" labelValue={addressText} />
            <DisplayLabelValue labelText="Duration:" labelValue={durationOfJob} />
            <DisplayLabelValue labelText="State:" labelValue={state} />

            <DisplayLabelValue
              labelText="Bids:"
              labelValue={`${_bidsListRef ? _bidsListRef.length : 0}`}
            />
            <DisplayLabelValue
              labelText="Viewed:"
              labelValue={`${viewedBy ? viewedBy.length : 0} times`}
            />
            <DisplayLabelValue
              labelText="Booed:"
              labelValue={`${booedBy ? booedBy.length : 0} times`}
            />
            <DisplayLabelValue
              labelText="Reported:"
              labelValue={`${reported ? reported.length : 0} times`}
            />

            <div className="has-text-dark is-size-7">Detailed Description</div>
            <span className="is-size-7">
              <TextareaAutosize
                value={detailedDescription}
                className="textarea is-marginless is-paddingless is-size-6"
                style={{
                  resize: 'none',
                  border: 'none',
                  color: '#4a4a4a',
                  fontSize: '1rem',
                  fontWeight: '700',
                }}
                readOnly
              />
            </span>

            <p className="is-size-7">
              <span style={{ fontSize: '10px', color: 'grey' }}>
                {`Posted (${daysSinceCreated} ago)`}
              </span>
            </p>
          </div>
        </div>
        <br />
        <CountDownComponent
          startingDate={startingDateAndTime.date}
          render={({ days, hours, minutes, seconds }) => {
            return (
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
  }
}
