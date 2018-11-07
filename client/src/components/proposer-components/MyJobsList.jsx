import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { templatesRepo } from '../../constants/bidOrBooTaskRepo';
import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

class MyJobsList extends React.Component {
  static propTypes = {
    userDetails: PropTypes.object.isRequired,
    jobsList: PropTypes.array.isRequired,
    deleteJob: PropTypes.func,
  };

  static defaultProps = {
    deleteJob: null,
  };

  render() {
    const { jobsList } = this.props;
    const userHasPostedJobs = jobsList && jobsList.map && jobsList.length > 0;

    return userHasPostedJobs ? (
      <React.Fragment>
        <JobsWithBids {...this.props} />
        <JobsWithoutBids {...this.props} />
      </React.Fragment>
    ) : (
      <EmptyState />
    );
  }
}

export default MyJobsList;

const JobsWithBids = (props) => {
  const { jobsList } = props;
  const jobsWithBids = jobsList
    .filter((job) => {
      return job._bidsRef && job._bidsRef.map && job._bidsRef.length > 0;
    })
    .map((job) => {
      return (
        <div key={job._id} className="column is-one-third">
          <JobSummaryView job={job} areThereAnyBidders {...props} />
        </div>
      );
    });
  return jobsWithBids;
};

const JobsWithoutBids = (props) => {
  const { jobsList } = props;
  const jobsWithoutBids = jobsList
    .filter((job) => {
      return !(job._bidsRef && job._bidsRef.map && job._bidsRef.length > 0);
    })
    .map((job) => {
      return (
        <div key={job._id} className="column is-one-third">
          <JobSummaryView job={job} {...props} />
        </div>
      );
    });
  return jobsWithoutBids;
};

const EmptyState = () => (
  <div className="container">
    <div>Sorry you have not posted any jobs</div>
    <div>
      <a
        className="button is-primary"
        onClick={(e) => {
          e.preventDefault();
          switchRoute(ROUTES.CLIENT.PROPOSER.root);
        }}
      >
        Post New Jobs
      </a>
    </div>
  </div>
);

class JobSummaryView extends React.Component {
  render() {
    const { job, userDetails, areThereAnyBidders, deleteJob } = this.props;
    const { startingDateAndTime, title, createdAt, fromTemplateId, state } = job;

    // get details about the user
    let temp = userDetails ? userDetails : { profileImage: '', displayName: '' };
    const { profileImage, displayName } = temp;

    let daysSinceCreated = '';
    let createdAtToLocal = '';

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

          {/* xxxx delete button */}
          {deleteJob && (
            <a
              className="card-header-icon"
              aria-label="more options"
              onClick={(e) => {
                e.preventDefault();
                deleteJob(job._id);
              }}
            >
              <span style={{ color: 'grey' }} className="icon">
                <i className="far fa-trash-alt" aria-hidden="true" />
              </span>
            </a>
          )}
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
              <a disabled className="button is-outlined is-fullwidth is-large">
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
                  switchRoute(`${ROUTES.CLIENT.PROPOSER.selectedPostedJobPage}/${job._id}`);
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
