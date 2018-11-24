import React from 'react';

import moment from 'moment';
import { templatesRepo } from '../../constants/bidOrBooTaskRepo';

export default class JobDetailsViewForBidder extends React.Component {
  render() {
    const { job } = this.props;

    if (!job || !job._id) {
      return null;
    }
    const {
      createdAt,
      fromTemplateId,
      durationOfJob,
      startingDateAndTime,
      title,
      _ownerRef,
      detailedDescription,
    } = job;

    let temp = _ownerRef ? _ownerRef : { profileImage: '', displayName: '' };
    const { profileImage, displayName } = temp;
    const { hours, minutes, period } = startingDateAndTime;
    let daysSinceCreated = '';
    let createdAtToLocal = '';

    try {
      daysSinceCreated = createdAt
        ? moment.duration(moment().diff(moment(createdAt))).humanize()
        : 0;
      createdAtToLocal = moment(createdAt)
        .local()
        .format('YYYY-MM-DD hh:mm A');
    } catch (e) {
      console.error(e);
    }

    return (
      <div className="card">
        <header style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }} className="card-header">
          <p className="card-header-title">
            <i style={{ marginRight: 4 }} className="fab fa-reddit-alien" />
            {templatesRepo[fromTemplateId].title}
          </p>
        </header>
        <div className="card-image is-clipped">
          <img
            className="bdb-cover-img"
            src={`${
              templatesRepo[fromTemplateId] && templatesRepo[fromTemplateId].imageUrl
                ? templatesRepo[fromTemplateId].imageUrl
                : 'https://vignette.wikia.nocookie.net/kongregate/images/9/96/Unknown_flag.png/revision/latest?cb=20100825093317'
            }`}
          />
        </div>
        <div className="card-content">
          <div className="media">
            <div className="media-left">
              <figure style={{ margin: '0 auto' }} className="image is-48x48">
                <img src={profileImage.url} alt="user" />
              </figure>
            </div>
            <div className="media-content">
              <p className="title is-12">{displayName}</p>
            </div>
          </div>

          <div className="content">
            <p className="heading">
              <span>Service Type</span>
              <br />
              <span className="has-text-weight-semibold">
                {templatesRepo[fromTemplateId].title || 'not specified'}
              </span>
            </p>
            <p className="heading">
              <span>Active since</span>
              <br />
              <span className="has-text-weight-semibold">
                {createdAtToLocal}
                <span style={{ fontSize: '10px', color: 'grey' }}>
                  {` (${daysSinceCreated} ago)`}
                </span>
              </span>
            </p>
            <p className="heading">
              <span>Start Date</span>
              <br />
              <span className="has-text-weight-semibold">
                {startingDateAndTime && moment(startingDateAndTime.date).format('MMMM Do YYYY')}
              </span>
            </p>
            <p className="heading">
              <span>Start Time</span>
              <br />
              <span className="has-text-weight-semibold">
                {hours}:{minutes === 0 ? '00' : minutes} {period}
              </span>
            </p>
            <p className="heading">
              <span>Duration Required</span>
              <br />
              <span className="has-text-weight-semibold">{durationOfJob || 'not specified'}</span>
            </p>
            <p className="heading">
              <span>Detailed Description</span>
              <br />
              <span className="has-text-weight-semibold">
                {detailedDescription || 'not specified'}
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }
}
