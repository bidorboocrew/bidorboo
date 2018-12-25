import React from 'react';
import moment from 'moment';

import { switchRoute } from '../../../utils';
import * as ROUTES from '../../../constants/frontend-route-consts';

import { templatesRepo } from '../../../constants/bidOrBooTaskRepo';
import { DisplayLabelValue, CountDownComponent } from './commonComponents';

export default class JobSummaryForPostedJobs extends React.Component {
  render() {
    const { job, userDetails, deleteJob, notificationFeed } = this.props;
    const {
      startingDateAndTime,
      createdAt,
      fromTemplateId,
      _bidsListRef,
      addressText,
      viewedBy,
    } = job;

    // in case we cant find the job
    if (!templatesRepo[fromTemplateId]) {
      return null;
    }

    let temp = userDetails
      ? userDetails
      : { profileImage: { url: '' }, displayName: '', rating: { globalRating: 'No Ratings Yet' } };

    const { profileImage, displayName, rating } = temp;
    let daysSinceCreated = '';
    try {
      daysSinceCreated = createdAt
        ? moment.duration(moment().diff(moment(createdAt))).humanize()
        : 0;
    } catch (e) {
      //xxx we dont wana fail simply cuz we did not get the diff in time
      console.error(e);
    }

    return (
      <div className="card bidderRootSpecial is-clipped">
        <header
          style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
          className="card-header is-clipped"
        >
          <p className="card-header-title">{templatesRepo[fromTemplateId].title}</p>

          <a className="card-header-icon">
            <span
              className={`${
                _bidsListRef && _bidsListRef.length === 0 ? 'has-text-grey' : 'has-text-success'
              }`}
            >
              <i style={{ marginRight: 2 }} className="fas fa-hand-paper" />
              {`${_bidsListRef ? _bidsListRef.length : 0} bids`}
            </span>
          </a>

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
        <div
          style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem', position: 'relative' }}
          className="card-content"
        >
          <div className="content">
            <DisplayLabelValue
              labelText="Start Date:"
              labelValue={
                startingDateAndTime && ` ${moment(startingDateAndTime.date).format('MMMM Do YYYY')}`
              }
            />

            <DisplayLabelValue labelText="Address:" labelValue={addressText} />
            <DisplayLabelValue
              labelText="Viewed:"
              labelValue={`${viewedBy ? viewedBy.length : 0} times`}
            />

            <p className="is-size-7">
              <span style={{ fontSize: '10px', color: 'grey' }}>
                {`Posted (${daysSinceCreated} ago)`}
              </span>
            </p>
          </div>
        </div>
        {renderFooter({ job, notificationFeed })}
        <br />
        <CountDownComponent
          startingDate={startingDateAndTime.date}
          render={({ days, hours, minutes, seconds }) => {
            return (
              <React.Fragment>
                {days && !`${days}`.includes('NaN') ? (
                  <div className="has-text-white">{`expires in ${days} days ${hours}h ${minutes}m ${seconds}s`}</div>
                ) : null}
              </React.Fragment>
            );
          }}
        />
      </div>
    );
  }
}

const renderFooter = ({ job, notificationFeed }) => {
  let areThereAnyBidders = job._bidsListRef && job._bidsListRef.length > 0;
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
    <footer className="card-footer">
      <div className="card-footer-item">
        <a
          className={`button is-fullwidth ${areThereAnyBidders ? 'is-success' : 'is-outline'}`}
          onClick={(e) => {
            e.preventDefault();
            switchRoute(`${ROUTES.CLIENT.PROPOSER.reviewRequestAndBidsPage}/${job._id}`);
          }}
        >
          <span className="icon">
            <i className="fa fa-hand-paper" />
          </span>
          <span style={{ marginLeft: 4 }}>View Bids</span>
          {areThereAnyBidders && doesthisJobHaveNewBids && (
            <span style={{ marginLeft: 4 }} className="tag is-dark">
              +{numberOfNewBids}
            </span>
          )}
        </a>
      </div>
    </footer>
  );
};
