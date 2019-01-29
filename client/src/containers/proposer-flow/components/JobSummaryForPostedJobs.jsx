import React from 'react';
import moment from 'moment';

import { switchRoute } from '../../../utils';
import * as ROUTES from '../../../constants/frontend-route-consts';

import { templatesRepo } from '../../../constants/bidOrBooTaskRepo';
import {
  DisplayLabelValue,
  CountDownComponent,
  getDaysSinceCreated,
  JobStats,
  StartDateAndTime,
} from '../../commonComponents';

export default class JobSummaryForPostedJobs extends React.Component {
  render() {
    const { job, deleteJob, notificationFeed } = this.props;
    const {
      startingDateAndTime,
      createdAt,
      fromTemplateId,
      _bidsListRef,
      addressText,
      viewedBy,
    } = job;

    let daysSinceCreated = getDaysSinceCreated(createdAt);

    return (
      <div
        onClick={(e) => {
          e.preventDefault();
          switchRoute(`${ROUTES.CLIENT.PROPOSER.reviewRequestAndBidsPage}/${job._id}`);
        }}
        className="card bidderRootSpecial is-clipped"
      >
        <header
          style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
          className="card-header is-clipped"
        >
          <p className="card-header-title">{templatesRepo[fromTemplateId].title}</p>

          <a
            className={`card-header-icon ${
              _bidsListRef && _bidsListRef.length === 0 ? 'has-text-grey' : 'has-text-success'
            }`}
          >
            <span className="icon">
              <i className="fas fa-hand-paper" />
            </span>
            <span>{`${_bidsListRef ? _bidsListRef.length : 0} bids`}</span>
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
            <StartDateAndTime date={startingDateAndTime} />

            <DisplayLabelValue labelText="Address:" labelValue={addressText} />

            <JobStats daysSinceCreated={daysSinceCreated} viewedBy={viewedBy} />
          </div>
        </div>
        {renderFooter({ job, notificationFeed })}
        <CountDownComponent startingDate={startingDateAndTime} isJobStart={false} />
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
        <a className={`button is-fullwidth ${areThereAnyBidders ? 'is-success' : 'is-outline'}`}>
          <span className="icon">
            <i className="fa fa-hand-paper" />
          </span>
          {areThereAnyBidders && <span style={{ marginLeft: 4 }}>View Bids</span>}
          {!areThereAnyBidders && <span style={{ marginLeft: 4 }}>View Details</span>}
          {areThereAnyBidders && doesthisJobHaveNewBids && (
            <span style={{ marginLeft: 4 }} className="tag is-danger">
              +{numberOfNewBids}
            </span>
          )}
        </a>
      </div>
    </footer>
  );
};
