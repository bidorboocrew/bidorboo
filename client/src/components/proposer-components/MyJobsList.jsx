import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { templatesRepo } from '../../constants/bidOrBooTaskRepo';
import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

class MyJobsList extends React.Component {
  static propTypes = {
    selectJobHandler: PropTypes.func.isRequired,
    userDetails: PropTypes.object.isRequired,
    jobsList: PropTypes.array.isRequired,
  };
  render() {
    const { jobsList } = this.props;
    const userHasPostedJobs = jobsList && jobsList.map && jobsList.length > 0;

    const MyJobsList = userHasPostedJobs ? (
      jobsList.map((job) => {
        return (
          <div key={job._id} className="column is-one-third">
            <JobSummaryView job={job} {...this.props} />
          </div>
        );
      })
    ) : (
      <EmptyState />
    );

    return (
      <section className="section">
        <div className="container">
          <div
            // style={{ alignItems: 'flex-end' }}
            className="columns is-multiline"
          >
            {MyJobsList}
          </div>
        </div>
      </section>
    );
  }
}

export default MyJobsList;

const EmptyState = () => (
  <React.Fragment>
    <div>Sorry you have not posted any jobs</div>
    <div>
      <a
        className="button is-primary"
        onClick={(e) => {
          e.preventDefault();
          switchRoute(ROUTES.CLIENT.PROPOSER.root);
        }}
      >
        post jobs
      </a>
    </div>
  </React.Fragment>
);

class JobSummaryView extends React.Component {
  render() {
    const { job, selectJobHandler, userDetails } = this.props;
    const { startingDateAndTime, title, createdAt, fromTemplateId } = job;

    // get details about the user
    let temp = userDetails ? userDetails : { profileImage: '', displayName: '' };
    const { profileImage, displayName } = temp;

    let daysSinceCreated = '';
    let createdAtToLocal = '';

    const areThereAnyBidders =
      job._bidsListRef && job._bidsListRef.map && job._bidsListRef.length > 0;

    // set border for jobs with reviews
    let specialBorder = areThereAnyBidders ? { border: '1px solid #00d1b2' } : {};

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
      <div style={specialBorder} className="card postedJobToBidOnCard is-clipped">
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
              {profileImage &&
                profileImage.url && (
                  <figure style={{ margin: '0 auto' }} className="image is-32x32">
                    <img src={profileImage.url} alt="user" />
                  </figure>
                )}
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
              {startingDateAndTime && ` ${moment(startingDateAndTime.date).format('MMMM Do YYYY')}`}
            </p>
          </div>
        </div>
        <footer className="card-footer">
          <div className="card-footer-item">
            {!areThereAnyBidders && (
              <a
                disabled
                className="button is-outlined is-fullwidth is-large"
              >
                <span style={{ marginLeft: 4 }}>
                  <i className="fa fa-hand-paper" /> No Bids Yet
                </span>
              </a>
            )}
            {/* show as enabled cuz there is bidders */}
            {areThereAnyBidders && (
              <a
                className="button is-primary is-fullwidth is-large"
                onClick={(e) => {
                  e.preventDefault();
                  selectJobHandler(job);
                }}
              >
                <span style={{ marginLeft: 4 }}>
                  <i className="fa fa-hand-paper" /> Review Bids
                </span>
              </a>
            )}
          </div>
        </footer>
      </div>
    );
  }
}
