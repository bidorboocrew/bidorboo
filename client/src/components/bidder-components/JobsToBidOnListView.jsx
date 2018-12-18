import React from 'react';
import moment from 'moment';

import { templatesRepo } from '../../constants/bidOrBooTaskRepo';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

const TAB_IDS = {
  openRequests: 'Requests',
  postedBids: 'Posted Bids',
  mine: 'Mine',
};

class JobsToBidOnListView extends React.Component {
  render() {
    const { jobsList, activeTab } = this.props;

    const postedJobsList =
      jobsList && jobsList.map && jobsList.length > 0 ? (
        <React.Fragment>
          <div className="columns is-multiline is-mobile">
            {activeTab === TAB_IDS.openRequests && <OtherPeoplesJobs {...this.props} />}

            {activeTab === TAB_IDS.mine && <MyJobs {...this.props} />}
          </div>
        </React.Fragment>
      ) : (
        <EmptyStateComponent />
      );
    return <React.Fragment>{postedJobsList}</React.Fragment>;
  }
}
export default JobsToBidOnListView;

const OtherPeoplesJobs = (props) => {
  const { isLoggedIn, currentUserId, showLoginDialog, selectJobToBidOn, jobsList } = props;

  const otherPeopleJobs = jobsList.filter((job) => job._ownerRef._id !== currentUserId);

  const components = otherPeopleJobs.map((job) => {
    return (
      <div
        key={job._id}
        className="column"
        onClick={() => {
          if (!isLoggedIn) {
            showLoginDialog(true);
          } else {
            selectJobToBidOn(job);
          }
        }}
      >
        <JobsToBidOnSummaryCard job={job} />
      </div>
    );
  });
  return components && components.length > 0 ? components : null;
};

const MyJobs = (props) => {
  const { isLoggedIn, currentUserId, showLoginDialog, selectJobToBidOn, jobsList } = props;

  const myjobs = jobsList.filter((job) => job._ownerRef._id === currentUserId);

  const components = myjobs.map((job) => {
    return (
      <div
        key={job._id}
        className="column"
        onClick={() => {
          if (!isLoggedIn) {
            showLoginDialog(true);
          } else {
            // selectJobToBidOn(job);
          }
        }}
      >
        <JobsToBidOnSummaryCard myJob job={job} />
      </div>
    );
  });
  return components && components.length > 0 ? components : null;
};
const EmptyStateComponent = () => {
  return (
    <div className="HorizontalAligner-center column">
      <div className="card is-fullwidth">
        <div className="card-content">
          <div className="content has-text-centered">
            <div className="is-size-5">Couldn't find any. please check again later!</div>
            <br />
            <a
              className="button is-primary "
              onClick={() => {
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
};

class JobsToBidOnSummaryCard extends React.Component {
  render() {
    const { job, myJob } = this.props;
    const { startingDateAndTime, createdAt, fromTemplateId, _ownerRef } = job;
    let temp = _ownerRef
      ? _ownerRef
      : { profileImage: { url: '' }, displayName: '', rating: { globalRating: 'No Ratings Yet' } };

    const { profileImage, displayName, rating } = temp;

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
      <div className={`card bidderRootSpecial is-clipped ${myJob ? 'disabled' : ''}`}>
        <header
          style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
          className="card-header is-clipped"
        >
          <p className="card-header-title">{`${templatesRepo[fromTemplateId].title}`}</p>
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
        <div style={{ paddingBottom: '0.25rem', paddingTop: '0.25rem' }} className="card-content">
          <div class="media">
            <div class="media-left">
              <figure class="image is-48x48">
                <img src={profileImage.url} alt="Placeholder image" />
              </figure>
            </div>
            <div class="media-content">
              <p class="is-size-6">{displayName}</p>
              <p class="is-size-7">{rating.globalRating}</p>
            </div>
          </div>
          <div className="content">
            <div className="is-size-7">
              Due on:
              {startingDateAndTime && ` ${moment(startingDateAndTime.date).format('MMMM Do YYYY')}`}
            </div>
            <div className="is-size-7">
              {/* Active since {createdAtToLocal} */}
              <span style={{ fontSize: '10px', color: 'grey' }}>
                {`posted (${daysSinceCreated} ago)`}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
