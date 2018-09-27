import React from 'react';

import PropTypes from 'prop-types';

import moment from 'moment';
import { templatesRepo } from '../../constants/bidOrBooTaskRepo';
import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';


export default class PostedJobsToBidOnCard extends React.Component {
  static propTypes = {
    isLoggedIn: PropTypes.bool,
    showLoginDialog: PropTypes.func,
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
          profileImage: PropTypes.shape({
            url: PropTypes.string.isRequired,
            public_id: PropTypes.string
          }),
        })
      })
    ),
    currentUserId: PropTypes.string,
    selectJobToBidOn: PropTypes.func.isRequired
  };

  render() {
    const {
      jobsList,
      currentUserId,
      selectJobToBidOn,
      isLoggedIn,
      showLoginDialog
    } = this.props;
    const postedJobsList =
      jobsList && jobsList.map && jobsList.length > 0 ? (
        jobsList.map((job, index) => (
          <JobCard
            currentUserId={currentUserId}
            key={job._id}
            jobObj={job}
            jobCounterIndex={index}
            selectJobToBidOn={selectJobToBidOn}
            isLoggedIn={isLoggedIn}
            showLoginDialog={showLoginDialog}
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
                switchRoute(ROUTES.CLIENT.PROPOSER.root);
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

const JobCard = props => {
  const {
    jobObj,
    jobCounterIndex,
    currentUserId,
    selectJobToBidOn,
    isLoggedIn,
    showLoginDialog
  } = props;
  return (
    <div className="column is-one-third">
      <SummaryView
        currentUserId={currentUserId}
        jobCounterIndex={jobCounterIndex}
        jobObj={jobObj}
        selectJobToBidOn={selectJobToBidOn}
        isLoggedIn={isLoggedIn}
        showLoginDialog={showLoginDialog}
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
      selectJobToBidOn,
      isLoggedIn,
      showLoginDialog
    } = this.props;
    const {
      startingDateAndTime,
      title,
      createdAt,
      _bidsList,
      fromTemplateId,
      _ownerId
    } = jobObj;

    const { profileImage, displayName } = _ownerId;
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
      <div
        onClick={() => {
          if (!isLoggedIn) {
            showLoginDialog(true);
          } else {
            if (_ownerId._id !== currentUserId) {
              selectJobToBidOn(jobObj);
            }
          }
        }}
        className="card postedJobToBidOnCard  is-clipped"
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
              <figure className="image is-32x32">
                <img src={profileImage.url} alt="user" />
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
          </div>
        </div>

        {(!isLoggedIn || _ownerId._id !== currentUserId) && (
          <div className="has-text-centered" style={{ textAlign: 'center' }}>
            <a
              onClick={() => {
                if (!isLoggedIn) {
                  showLoginDialog(true);
                } else {
                  if (_ownerId._id !== currentUserId) {
                    selectJobToBidOn(jobObj);
                  }
                }
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
        {isLoggedIn &&
          _ownerId._id === currentUserId && (
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
