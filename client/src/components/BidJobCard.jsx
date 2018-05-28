import React from 'react';
import { templatesRepo } from '../constants/bidOrBooTaskRepo';
import PropTypes from 'prop-types';
import * as ROUTES from '../constants/frontend-route-consts';
import moment from 'moment';

class BidJobCard extends React.Component {
  static propTypes = {
    // this is the job object structure from the server
    jobsList: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
        createdAt: PropTypes.string,
        addressText: PropTypes.string,
        durationOfJob: PropTypes.string,
        location: PropTypes.shape({
          coordinates: PropTypes.arrayOf(PropTypes.number),
          type: PropTypes.string
        }),
        startingDateAndTime: PropTypes.shape({
          date: PropTypes.string,
          hours: PropTypes.number,
          minutes: PropTypes.number,
          period: PropTypes.string
        }),
        state: PropTypes.string,
        title: PropTypes.string,
        updatedAt: PropTypes.string,
        whoSeenThis: PropTypes.array,
        _bidsList: PropTypes.array,
        _ownerId: PropTypes.shape({
          displayName: PropTypes.string,
          profileImgUrl: PropTypes.string
        })
      })
    ),
    currentUserId: PropTypes.string,
    switchRoute: PropTypes.func.isRequired,
    selectJobToBidOn: PropTypes.func.isRequired
  };

  render() {
    const {
      jobsList,
      switchRoute,
      currentUserId,
      selectJobToBidOn
    } = this.props;
    const postedJobsList =
      jobsList && jobsList.map && jobsList.length > 0 ? (
        jobsList.map((job, index) => (
          <JobCard
            switchRoute={switchRoute}
            currentUserId={currentUserId}
            key={job._id}
            jobObj={job}
            jobCounterIndex={index}
            selectJobToBidOn={selectJobToBidOn}
          />
        ))
      ) : (
        <React.Fragment>
          <div>
            Sorry All jobs have been awarded to bidders , check again later.
          </div>
          <div>
            <a
              className="button is-primary"
              onClick={() => {
                switchRoute(ROUTES.FRONTENDROUTES.PROPOSER.root);
              }}
            >
              post a new job
            </a>
          </div>
        </React.Fragment>
      );
    return <React.Fragment>{postedJobsList}</React.Fragment>;
  }
}

export default BidJobCard;

const JobCard = props => {
  const {
    jobObj,
    jobCounterIndex,
    currentUserId,
    switchRoute,
    selectJobToBidOn
  } = props;
  return (
    <div className="column is-one-third">
      <SummaryView
        currentUserId={currentUserId}
        jobCounterIndex={jobCounterIndex}
        jobObj={jobObj}
        selectJobToBidOn={selectJobToBidOn}
      />
    </div>
  );
};

class SummaryView extends React.Component {
  render() {
    const {
      jobCounterIndex,
      jobObj,
      currentUserId,
      selectJobToBidOn
    } = this.props;
    const {
      state,
      addressText,
      durationOfJob,
      location,
      startingDateAndTime,
      title,
      updatedAt,
      whoSeenThis,
      createdAt,
      _bidsList,
      fromTemplateId,
      _ownerId
    } = jobObj;

    const { profileImgUrl, displayName } = _ownerId;
    const areThereAnyBidders =
      _bidsList && _bidsList.map && _bidsList.length > 0;
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
      <div className="card bidJobCard  is-clipped">
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
              <figure className="image is-32x32">
                <img src={profileImgUrl} alt="user" />
              </figure>
            </div>
            <div className="media-content">
              <p className="title is-6">{displayName}</p>
              {/* <p className="subtitle is-6">{email}</p> */}
            </div>
          </div>

          <div className="content">
            <p className="heading"># {jobCounterIndex}</p>
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
            {/* <p className="heading">Status {state}</p> */}
            {/* <p className="heading">
              last updated {moment(updatedAt).format('MMMM Do YYYY')}
            </p> */}

            {areThereAnyBidders && (
              <div className="card">
                <header className="card-header">
                  <div
                    style={{ paddingBottom: 10, paddingTop: 10 }}
                    className="card-header-title card-content"
                  >
                    <span style={{ padding: '0.5rem 0.75rem' }}>Bids</span>
                  </div>
                </header>
              </div>
            )}
          </div>
        </div>

        {_ownerId._id !== currentUserId && (
          <div className="has-text-centered" style={{ textAlign: 'center' }}>
            <a
              onClick={() => {
                selectJobToBidOn(jobObj);
              }}
              style={{ borderRadius: 0 }}
              className="button is-primary is-fullwidth is-large"
            >
              <span style={{ marginLeft: 4 }}>
                <i className="fas fa-dollar-sign" /> Bid Now
              </span>
            </a>
          </div>
        )}
        {_ownerId._id === currentUserId && (
          <div className="has-text-centered" style={{ textAlign: 'center' }}>
            <a
              style={{ borderRadius: 0 }}
              className="button is-static is-fullwidth disabled is-large"
            >
              My Job
            </a>
          </div>
        )}
      </div>
    );
  }
}
