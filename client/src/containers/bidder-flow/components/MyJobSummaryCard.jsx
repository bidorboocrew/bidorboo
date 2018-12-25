import React from 'react';
import moment from 'moment';

import * as ROUTES from '../../../constants/frontend-route-consts';
import { switchRoute } from '../../../utils';

import { templatesRepo } from '../../../constants/bidOrBooTaskRepo';
import {
  DisplayLabelValue,
  CountDownComponent,
  CardTitleWithBidCount,
  JobStats,
  getDaysSinceCreated,
  MinBidDisplayLabelValue,
} from '../../commonComponents';

export default class MyJobSummaryCard extends React.Component {
  render() {
    const { job } = this.props;
    const { startingDateAndTime, createdAt, fromTemplateId, _bidsListRef, viewedBy } = job;

    let daysSinceCreated = getDaysSinceCreated(createdAt);
    return (
      <div
        onClick={(e) => {
          e.preventDefault();
          switchRoute(`${ROUTES.CLIENT.PROPOSER.reviewRequestAndBidsPage}/${job._id}`);
        }}
        className="card bidderRootSpecial is-clipped"
      >
        <CardTitleWithBidCount fromTemplateId={fromTemplateId} bidsList={_bidsListRef} />

        <div className="card-image is-clipped">
          <img className="bdb-cover-img" src={`${templatesRepo[fromTemplateId].imageUrl}`} />
        </div>
        <div
          style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem', position: 'relative' }}
          className="card-content"
        >
          <DisplayLabelValue labelText="Requester:" labelValue={'Me'} />
          <div className="content">
            <DisplayLabelValue
              labelText="Start Date:"
              labelValue={
                startingDateAndTime && ` ${moment(startingDateAndTime.date).format('MMMM Do YYYY')}`
              }
            />
            <MinBidDisplayLabelValue bidsList={_bidsListRef} />

            <JobStats daysSinceCreated={daysSinceCreated} viewedBy={viewedBy} />
          </div>
        </div>
        <CountDownComponent startingDate={startingDateAndTime.date} isJobStart={false} />
      </div>
    );
  }
}
