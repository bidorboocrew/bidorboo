import React from 'react';
import { templatesRepo } from '../constants/bidOrBooTaskRepo';
import PropTypes from 'prop-types';
import * as ROUTES from '../constants/route-const';
import classNames from 'classnames';
import autoBind from 'react-autobind';
import moment from 'moment';

class PostedJobCard extends React.Component {
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
        _bidsList: PropTypes.array
      })
    ),
    switchRoute: PropTypes.func.isRequired,
    userDetails: PropTypes.object
  };

  render() {
    const { jobsList, switchRoute, userDetails } = this.props;
    const MyJobsList =
      jobsList && jobsList.map && jobsList.length > 0 ? (
        jobsList.map((job, index) => (
          <JobCard
            userDetails={userDetails}
            key={job._id}
            jobObj={job}
            jobCounterIndex={index}
          />
        ))
      ) : (
        <React.Fragment>
          <div>Sorry you have not posted any jobs</div>
          <div>
            <a
              className="button is-primary"
              onClick={() => {
                switchRoute(ROUTES.FRONTENDROUTES.PROPOSER.root);
              }}
            >
              post jobs
            </a>
          </div>
        </React.Fragment>
      );
    return (
      <section className="section">
        <div className="container">
          <div className="columns is-multiline">{MyJobsList}</div>
        </div>
      </section>
    );
  }
}

export default PostedJobCard;

const JobCard = props => {
  const { jobObj, jobCounterIndex, userDetails } = props;
  return (
    <div className="column is-half">
      <SummaryView
        userDetails={userDetails}
        jobCounterIndex={jobCounterIndex}
        jobObj={jobObj}
      />
    </div>
  );
};

class SummaryView extends React.Component {
  render() {
    const { jobCounterIndex, userDetails, jobObj } = this.props;
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
      fromTemplateId
    } = jobObj;

    const {
      profileImgUrl,
      displayName,
      email,
      // address,
      personalParagraph,
      // creditCards,
      membershipStatus,
      phoneNumber
    } = userDetails;

    const areThereAnyBidders =
      _bidsList && _bidsList.map && _bidsList.length > 0;
    try {
      const daysSinceCreated = createdAt
        ? moment
            .duration(moment().diff(moment('2018-04-21T03:28:35.094Z')))
            .humanize()
        : 0;
    } catch (e) {
      //xxx we dont wana fail simply cuz we did not get the diff in time
      console.error(e);
    }

    return (
      <div className="card postedJobCard">
        <div className="card-image">
          <figure className="image is-2by1">
            <img
              src={
                templatesRepo[fromTemplateId] &&
                templatesRepo[fromTemplateId].imageUrl
                  ? templatesRepo[fromTemplateId].imageUrl
                  : 'https://vignette.wikia.nocookie.net/kongregate/images/9/96/Unknown_flag.png/revision/latest?cb=20100825093317'
              }
              alt="Placeholder image"
            />
          </figure>
        </div>
        <div className="card-content">
          <div className="media">
            <div className="media-left">
              <figure className="image is-48x48">
                <img src={profileImgUrl} alt="user image image" />
              </figure>
            </div>
            <div className="media-content">
              <p className="title is-4">{displayName}</p>
              <p className="subtitle is-6">{email}</p>
            </div>
          </div>

          <div className="content">
            <p className="heading"># {jobCounterIndex}</p>
            <p style={{fontWeight: 500}}>{title || 'Job Title'}</p>
            <p className="heading">
              Active since
              {createdAt
                ? ` ${moment
                    .duration(moment().diff(moment('2018-04-21T03:28:35.094Z')))
                    .humanize()}`
                : null}
            </p>
            <p className="heading">
              anticipated start Date
              {startingDateAndTime &&
                moment(startingDateAndTime.date).format('MMMM Do YYYY')}
            </p>
            <p className="heading">Status {state}</p>
            <p className="heading">
              last updated {moment(updatedAt).format('MMMM Do YYYY')}
            </p>

            <div className="card">
              {areThereAnyBidders && (
                <header className="card-header">
                  <div
                    style={{ paddingBottom: 10, paddingTop: 10 }}
                    className="card-header-title card-content"
                  >
                    <span style={{ padding: '0.5rem 0.75rem' }}>Bids</span>
                  </div>
                </header>
              )}
              <div className="content">
                <BidsTable bidList={_bidsList} />
              </div>
            </div>
          </div>
        </div>
        <div
          style={{ border: 'none' }}
          className="panel-block is-paddingless is-marginless"
        >
          {areThereAnyBidders && (
            <button
              style={{
                borderBottom: 'none',
                borderRight: 'none',
                borderLeft: 'none',
                borderRadius: 0
              }}
              className="button is-outlined is-fullwidth is-large"
            >
              <span className="title">Review and Award Bids</span>
            </button>
          )}
          {!areThereAnyBidders && (
            <button
              disabled
              style={{
                borderBottom: 'none',
                borderRight: 'none',
                borderLeft: 'none',
                borderRadius: 0
              }}
              className="button is-outlined is-fullwidth is-large"
            >
              <span className="title">Review and Award Bids</span>
            </button>
          )}
        </div>
      </div>
    );
  }
}

class BidsTable extends React.Component {
  render() {
    const { bidList } = this.props;
    const BidsTable =
      bidList && bidList.map && bidList.length > 0 ? (
        <table className="table is-full-width">
          <thead>
            <tr>
              <th>#</th>
              <th>Bidder Rating</th>
              <th>Bid Amount</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>1</td>
              <td>5 stars</td>
              <td>38$</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <table className="table is-full-width">
          <thead style={{ backgroundColor: '#bdbdbd' }}>
            <tr>
              <th>No Bidders</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>
                No Bids Yet, Keep an eye and check again in a little while
              </td>
            </tr>
          </tbody>
        </table>
      );
    return <React.Fragment>{BidsTable}</React.Fragment>;
  }
}

class DetailedView extends React.Component {
  render() {
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
      _ownerId,
      _id
    } = this.props.jobObj;

    return (
      <div className="card">
        <div className="card-content">
          <div className="content">
            <div> Development view , details </div>
            <div>state : {state}</div>
            <div>addressText : {addressText}</div>
            <div>durationOfJob : {durationOfJob}</div>
            <div>location : {JSON.stringify(location)}</div>
            <div>title : {title}</div>
            <div>whoSeenThis : {JSON.stringify(whoSeenThis)}</div>
            <div>updatedAt : {updatedAt}</div>
            <div>_bidsList : {JSON.stringify(_bidsList)}</div>
            <div>_ownerId : {JSON.stringify(_ownerId)}</div>
            <div>jobId : {JSON.stringify(_id)}</div>
          </div>
        </div>
        <footer className="card-footer">
          <div>
            this is a dev view only and will be replaced with more user friendly
            details soon
          </div>
        </footer>
      </div>
    );
  }
}
