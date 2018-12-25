import React from 'react';
import moment from 'moment';

import { switchRoute } from '../../../utils';
import * as ROUTES from '../../../constants/frontend-route-consts';

import { templatesRepo } from '../../../constants/bidOrBooTaskRepo';
import { DisplayLabelValue, CountDownComponent } from './commonComponents';

export default class MyJobSummaryCard extends React.Component {
  render() {
    const { job, userDetails } = this.props;
    const {
      startingDateAndTime,
      createdAt,
      fromTemplateId,
      _bidsListRef,
      addressText,
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
      <div className="card bidderRootSpecial is-clipped disabled">
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
