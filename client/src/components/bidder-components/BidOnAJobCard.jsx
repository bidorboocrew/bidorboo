import React from 'react';
import moment from 'moment';

import * as ROUTES from '../../constants/frontend-route-consts';
import { templatesRepo } from '../../constants/bidOrBooTaskRepo';
import PostYourBid from '../../components/forms/PostYourBid';

export default class BidOnAJobCard extends React.Component {
  render() {
    const { jobDetails, switchRoute, onSubmit } = this.props;

    if (!jobDetails || !jobDetails._ownerId) {
      return null;
    }
    const {
      _id,
      createdAt,
      fromTemplateId,
      durationOfJob,
      startingDateAndTime,
      title,
      _ownerId,
      detailedDescription
    } = jobDetails;

    const { profileImgUrl, displayName } = _ownerId;
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
      <React.Fragment>
        <PostYourBid
          onSubmit={values => {
            onSubmit({ jobId: _id, bidAmount: values.bidAmountField });
          }}
          onCancel={() => {
            switchRoute(ROUTES.FRONTENDROUTES.BIDDER.root);
          }}
        />
        <div className="card">
          <header
            style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
            className="card-header"
          >
            <p className="card-header-title">
              <i style={{ marginRight: 4 }} className="fab fa-reddit-alien" />
              Review: {title || 'Job Title'}
            </p>
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
                <figure className="image is-32x32">
                  <img src={profileImgUrl} alt="user" />
                </figure>
              </div>
              <div className="media-content">
                <p className="title is-12">{displayName}</p>
              </div>
            </div>

            <div className="content">
              <p className="heading">
                <span>Job Type</span>
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
                  {startingDateAndTime &&
                    moment(startingDateAndTime.date).format('MMMM Do YYYY')}
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
                <span className="has-text-weight-semibold">
                  {durationOfJob || 'not specified'}
                </span>
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
      </React.Fragment>
    );
  }
}
