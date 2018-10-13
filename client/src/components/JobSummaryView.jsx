import React from 'react';

import PropTypes from 'prop-types';

import moment from 'moment';
import { templatesRepo } from '../constants/bidOrBooTaskRepo';

export default class JobSummaryView extends React.Component {
  static propTypes = {
    job: PropTypes.any.isRequired,
    specialStyle: PropTypes.any,
    onClickHandler: PropTypes.func
  };

  static defaultProps = {
    specialStyle: {},
    onClickHandler: () => null
  };

  render() {
    const { job, specialStyle } = this.props;
    const {
      startingDateAndTime,
      title,
      createdAt,
      fromTemplateId,
      _ownerRef
    } = job;

    const { profileImage, displayName } = _ownerRef;

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
      //xxx we dont wana fail simply cuz we did not get the diff in time
      console.error(e);
    }

    return (
      <div
        style={specialStyle}
        className="card postedJobToBidOnCard is-clipped"
      >
        <header
          style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
          className="card-header  is-clipped"
        >
          <p className="card-header-title">{title || 'Job Title'}</p>
        </header>
        <div className="card-image is-clipped">
          <figure className="image is-3by1">
            <img
              src={
                templatesRepo[fromTemplateId] &&
                templatesRepo[fromTemplateId].imageUrl
                  ? templatesRepo[fromTemplateId].imageUrl
                  : 'https://vignette.wikia.nocookie.net/kongregate/images/9/96/Unknown_flag.png/revision/latest?cb=20100825093317'
              }
              alt="Placeholder"
            />
          </figure>
        </div>
        <div className="card-content">
          <div className="media">
            <div className="media-left">
              <figure style={{ margin: '0 auto' }} className="image is-32x32">
                <img src={profileImage.url} alt="user" />
              </figure>
            </div>
            <div className="media-content">
              <p className="title is-6">{displayName}</p>
              {/* <p className="subtitle is-6">{email}</p> */}
            </div>
          </div>

          <div className="content">
            <p className="heading">
              Active since {createdAtToLocal}
              <span style={{ fontSize: '10px', color: 'grey' }}>
                {` (${daysSinceCreated} ago)`}
              </span>
            </p>
            <p className="heading">
              Start Date
              {startingDateAndTime &&
                ` ${moment(startingDateAndTime.date).format('MMMM Do YYYY')}`}
            </p>
          </div>
        </div>
      </div>
    );
  }
}
