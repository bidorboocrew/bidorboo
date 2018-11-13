import React from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';
import moment from 'moment';

import { templatesRepo } from '../../constants/bidOrBooTaskRepo';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
import { Spinner } from '../Spinner';

export default class CurrentOpenBidAndJobDetailsView extends React.Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    bid: PropTypes.object.isRequired,
    isLoading: PropTypes.bool,
    breadCrumb: PropTypes.node,
  };

  static defaultProps = {
    breadCrumb: null,
  };

  componentDidCatch() {
    switchRoute(ROUTES.CLIENT.ENTRY);
  }

  render() {
    const { bid, currentUser, breadCrumb, isLoading } = this.props;

    // loading indicator
    if (!bid || !bid._id || !bid._jobRef || !bid._jobRef._id) {
      return (
        <div className="container">
          <Spinner isLoading={isLoading} size={'large'} />
        </div>
      );
    }

    const { _jobRef: job } = bid;

    let pageContent = (
      <React.Fragment>
        {breadCrumb}
        <div className="container">
          <BidsTable bid={bid} currentUser={currentUser} />
          <PostedJobsDetails job={job} />
        </div>
      </React.Fragment>
    );

    return <React.Fragment>{pageContent}</React.Fragment>;
  }
}

class BidsTable extends React.Component {
  render() {
    const { bid, currentUser } = this.props;
    // find lowest bid details
    let tableRow = (
      <tr key={bid._id || Math.random()} style={{ wordWrap: 'break-word' }}>
        <td style={{ verticalAlign: 'middle' }} className="has-text-centered">
          {currentUser && currentUser.profileImage && currentUser.profileImage.url && (
            <figure style={{ margin: '0 auto' }} className="image is-64x64">
              <img alt="profile" src={currentUser.profileImage.url} />
            </figure>
          )}
        </td>
        <td style={{ verticalAlign: 'middle' }} className="has-text-centered">
          {currentUser && currentUser.rating ? `${currentUser.rating.globalRating}` : null}
        </td>
        <td style={{ verticalAlign: 'middle' }} className="has-text-centered">
          {bid.bidAmount && bid.bidAmount.value} {bid.bidAmount && bid.bidAmount.currency}
        </td>
      </tr>
    );

    return (
      <div className="columns is-centered">
        <div className="column is-half">
          <table
            style={{ border: '1px solid rgba(10, 10, 10, 0.1)' }}
            className="table is-hoverable table is-striped is-fullwidth"
          >
            <thead>
              <tr>
                <th className="has-text-centered">profile image</th>
                <th className="has-text-centered">Rating</th>
                <th className="has-text-centered">$</th>
              </tr>
            </thead>
            <tbody>{tableRow}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

class PostedJobsDetails extends React.Component {
  componentDidCatch() {
    switchRoute(ROUTES.CLIENT.ENTRY);
  }

  render() {
    const { job } = this.props;

    if (!job || !job._id) {
      switchRoute(ROUTES.CLIENT.BIDDER.mybids);
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
      <div className="columns is-centered">
        <div className="column is-half">
          <div className="card is-clipped">
            <header
              style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
              className="card-header"
            >
              <p className="card-header-title">Job Details: {title || 'Job Title'}</p>
            </header>
            <div className="card-image is-clipped">
              <figure className="image is-3by1">
                <img
                  src={
                    templatesRepo[fromTemplateId] && templatesRepo[fromTemplateId].imageUrl
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
        </div>
      </div>
    );
  }
}
