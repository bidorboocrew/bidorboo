import React from 'react';
import moment from 'moment';

import { templatesRepo } from '../../constants/bidOrBooTaskRepo';
import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

class MyRequestsTab extends React.Component {
  render() {
    const { jobsList } = this.props;

    const userHasPostedJobs = jobsList && jobsList.map && jobsList.length > 0;

    return userHasPostedJobs ? (
      <div className="columns is-multiline is-mobile">
        <MyRequests {...this.props} />
      </div>
    ) : (
      <EmptyStateComponent />
    );
  }
}

export default MyRequestsTab;

const EmptyStateComponent = () => (
  <div className="column">
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

const MyRequests = (props) => {
  const { jobsList } = props;

  const jobCards = jobsList.map((job) => {
    let areThereAnyBidders = job._bidsListRef && job._bidsListRef.length > 0;

    return (
      <div key={job._id} className="column">
        <MyPostedJobSummaryCard job={job} areThereAnyBidders={areThereAnyBidders} {...props} />
      </div>
    );
  });
  return jobCards;
};

class MyPostedJobSummaryCard extends React.Component {
  render() {
    const { job, userDetails, areThereAnyBidders, deleteJob, notificationFeed } = this.props;
    const { startingDateAndTime, createdAt, fromTemplateId } = job;

    // in case we cant find the job
    if (!templatesRepo[fromTemplateId]) {
      return null;
    }

    let daysSinceCreated = '';
    try {
      daysSinceCreated = createdAt
        ? moment.duration(moment().diff(moment(createdAt))).humanize()
        : 0;
    } catch (e) {
      //xxx we dont wana fail simply cuz we did not get the diff in time
      console.error(e);
    }

    let doesthisJobHaveNewBids = false;
    let numberOfNewBids = 0;

    if (notificationFeed.jobIdsWithNewBids) {
      for (let i = 0; i < notificationFeed.jobIdsWithNewBids.length; i++) {
        if (notificationFeed.jobIdsWithNewBids[i]._id === job._id) {
          doesthisJobHaveNewBids = true;
          numberOfNewBids = notificationFeed.jobIdsWithNewBids[i]._bidsListRef.length;
          break;
        }
      }
    }

    return (
      <div
        className={`card bidderRootSpecial is-clipped ${areThereAnyBidders ? null : 'disabled'}`}
      >
        <header
          style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
          className="card-header is-clipped"
        >
          <p className="card-header-title">{templatesRepo[fromTemplateId].title}</p>

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
        </header>
        <div className="card-image is-clipped">
          <img className="bdb-cover-img" src={`${templatesRepo[fromTemplateId].imageUrl}`} />
        </div>
        <div style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem' }} className="card-content">
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

            {areThereAnyBidders && (
              <a
                className="button is-fullwidth is-danger"
                onClick={(e) => {
                  e.preventDefault();
                  switchRoute(`${ROUTES.CLIENT.PROPOSER.selectedPostedJobPage}/${job._id}`);
                }}
              >
                <span className="icon">
                  <i className="fa fa-hand-paper" />
                </span>
                <span style={{ marginLeft: 4 }}>Review Bids</span>
                {areThereAnyBidders && doesthisJobHaveNewBids && (
                  <span style={{ marginLeft: 4 }} className="tag is-dark">
                    +{numberOfNewBids}
                  </span>
                )}
              </a>
            )}
          </div>
        </footer>
      </div>
    );
  }
}
