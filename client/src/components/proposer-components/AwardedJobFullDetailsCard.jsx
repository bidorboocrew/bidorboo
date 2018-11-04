import React from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';
import moment from 'moment';

import { templatesRepo } from '../../constants/bidOrBooTaskRepo';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

import OtherUserDetails from '../OtherUserDetails';

export default class AwardedJobFullDetailsCard extends React.Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    job: PropTypes.object.isRequired,
    breadCrumb: PropTypes.node,
  };

  static defaultProps = {
    breadCrumb: null,
  };

  constructor(props) {
    super(props);
    this.appRoot = document.querySelector('#bidorboo-root-view');
  }

  componentDidCatch() {
    switchRoute(ROUTES.CLIENT.PROPOSER.awardedJobsPage);
  }

  render() {
    const { job, currentUser, breadCrumb } = this.props;
    debugger;
    if (!job || !job._id || !job.awardedBid || !job.awardedBid._bidderRef) {
      switchRoute(ROUTES.CLIENT.PROPOSER.awardedJobsPage);
      return null;
    }

    const { _bidderRef } = job.awardedBid;
    const bidText = `${job.awardedBid.bidAmount.value} ${job.awardedBid.bidAmount.currency}`;
    const cardTitle = () => {
      return (
        <header className="card-header">
          <p className="card-header-title">
            <span className="has-text-primary is-capitalized has-text-weight-bold ">
              {`Bidder details (${bidText})`}
            </span>
          </p>
        </header>
      );
    };

    const cardFooter = () => (
      <React.Fragment>
        <div className="has-text-centered is-size-5 ">
          bid amount :
          <span className="has-text-primary is-capitalized has-text-weight-bold ">
            {` ${bidText}`}
          </span>
        </div>
        <footer className="card-footer">
          <div className="card-footer-item">
            <a
              onClick={() => alert('not implemented yet')}
              className="button is-primary is-fullwidth is-large"
            >
              Contact Bidder
            </a>
          </div>
          <div className="card-footer-item">
            <a
              onClick={() => switchRoute(ROUTES.CLIENT.PROPOSER.awardedJobsPage)}
              className="button is-danger is-outlined is-fullwidth is-large"
            >
              Go Back
            </a>
          </div>
        </footer>
      </React.Fragment>
    );

    return (
      <React.Fragment>
        {breadCrumb}
        {/* <React.Fragment>
        <h2 style={{ marginBottom: 2 }} className="subtitle">
          Bids List
        </h2>
        <BidsTable
          bidList={job._bidsListRef}
          currentUser={currentUser}
          showReviewModal={this.showReviewModal}
        />
      </React.Fragment> */}
          {_bidderRef && (
            <OtherUserDetails
              otherUserDetails={_bidderRef}
              cardFooter={cardFooter()}
              cardTitle={cardTitle()}
            />
          )}

          <br />

          <AwardedJobDetails job={job} currentUser={currentUser} />
      </React.Fragment>
    );
  }
}

class AwardedJobDetails extends React.Component {
  componentDidCatch() {
    switchRoute(ROUTES.CLIENT.PROPOSER.awardedJobsPage);
  }

  render() {
    const { job, currentUser } = this.props;

    if (!job || !job._id) {
      switchRoute(ROUTES.CLIENT.PROPOSER.awardedJobsPage);
      return null;
    }

    const {
      createdAt,
      fromTemplateId,
      durationOfJob,
      startingDateAndTime,
      title,
      detailedDescription,
    } = job;

    let temp = currentUser ? currentUser : { profileImage: '', displayName: '' };
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
              <p className="card-header-title">
                <i style={{ marginRight: 4 }} className="fab fa-reddit-alien" />
                Details: {title || 'Job Title'}
              </p>
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
