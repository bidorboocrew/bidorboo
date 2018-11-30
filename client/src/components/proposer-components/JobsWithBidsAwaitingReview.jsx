import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import windowSize from 'react-window-size';

import { templatesRepo } from '../../constants/bidOrBooTaskRepo';
import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute, BULMA_RESPONSIVE_SCREEN_SIZES } from '../../utils';

class JobsWithBidsAwaitingReview extends React.Component {
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

    return userHasPostedJobs ? <JobsWithBids {...this.props} /> : <EmptyStateComponent />;
  }
}

export default windowSize(JobsWithBidsAwaitingReview);

const JobsWithBids = (props) => {
  const { jobsList } = props;

  const columnCount = BULMA_RESPONSIVE_SCREEN_SIZES.isMobile(props)
    ? 'column is-half'
    : 'column is-one-fifth';

  const jobsWithBids = jobsList
    .filter((job) => {
      return job._bidsListRef && job._bidsListRef.map && job._bidsListRef.length > 0;
    })
    .map((job) => {
      return (
        <div key={job._id} className={columnCount}>
          <MyPostedJobSummaryCard job={job} areThereAnyBidders {...props} />
        </div>
      );
    });
  return jobsWithBids;
};

const EmptyStateComponent = () => (
  <div className="HorizontalAligner-center">
    <div className="card is-fullwidth">
      <div className="card-content">
        <div className="content has-text-centered">
          <div className="is-size-5">Sorry you have not posted any jobs.</div>
          <br />
          <a
            className="button is-primary "
            onClick={(e) => {
              e.preventDefault();
              switchRoute(ROUTES.CLIENT.PROPOSER.root);
            }}
          >
            Request a Service
          </a>
        </div>
      </div>
    </div>
  </div>
);

class MyPostedJobSummaryCard extends React.Component {
  render() {
    const { job, userDetails, areThereAnyBidders, deleteJob } = this.props;
    const { startingDateAndTime, title, createdAt, fromTemplateId } = job;

    // get details about the user
    let temp = userDetails ? userDetails : { profileImage: '', displayName: '' };
    const { profileImage, displayName } = temp;

    let daysSinceCreated = '';
    let createdAtToLocal = '';

    // set border for jobs with reviews
    let specialBorder = areThereAnyBidders ? { border: '1px solid #ff3860' } : {};

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
          className="card-header is-clipped"
        >
          <p className="card-header-title">{templatesRepo[fromTemplateId].title}</p>

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
          <img
            className="bdb-cover-img"
            src={`${
              templatesRepo[fromTemplateId] && templatesRepo[fromTemplateId].imageUrl
                ? templatesRepo[fromTemplateId].imageUrl
                : 'https://vignette.wikia.nocookie.net/kongregate/images/9/96/Unknown_flag.png/revision/latest?cb=20100825093317'
            }`}
          />
        </div>
        <div style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem' }} className="card-content">
          {/* <div className="media"> */}
          {/* <div className="media-left">
              {profileImage && profileImage.url && (
                <figure style={{ margin: '0 auto' }} className="image is-48x48">
                  <img src={profileImage.url} alt="user" />
                </figure>
              )}
            </div> */}
          {/* <div className="media-content">
              <p className="title is-6">{displayName}</p>
              {/* <p className="subtitle is-6">{email}</p> 
            </div> */}
          {/* </div> */}

          <div className="content">
            <p className="is-size-7">
              Start Date
              {startingDateAndTime && ` ${moment(startingDateAndTime.date).format('MMMM Do YYYY')}`}
            </p>
            <p className="is-size-7">
              <span style={{ fontSize: '10px', color: 'grey' }}>
                {`Posted (${daysSinceCreated} ago)`}
              </span>
            </p>
          </div>
        </div>
        <footer className="card-footer">
          <div className="card-footer-item">
            {!areThereAnyBidders && (
              <a disabled className="button is-outlined is-fullwidth ">
                <span style={{ marginLeft: 4 }}>
                  <i className="fa fa-hand-paper" /> No Bids Yet
                </span>
              </a>
            )}
            {/* show as enabled cuz there is bidders */}
            {areThereAnyBidders && (
              <a
                className="button is-fullwidth   is-danger"
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
