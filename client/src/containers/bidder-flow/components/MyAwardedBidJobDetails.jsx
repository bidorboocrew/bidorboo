import React from 'react';
import moment from 'moment';
import TextareaAutosize from 'react-autosize-textarea';

import { templatesRepo } from '../../../constants/bidOrBooTaskRepo';
import {
  DisplayLabelValue,
  CountDownComponent,
  UserImageAndRating,
  getDaysSinceCreated,
  JobStats,
  AvgBidDisplayLabelAndValue,
} from '../../commonComponents';

export default class MyAwardedBidJobDetails extends React.Component {
  render() {
    const { job } = this.props;
    const {
      startingDateAndTime,
      _bidsListRef,
      _ownerRef,
      state,
      viewedBy,
      detailedDescription,
      durationOfJob,
      fromTemplateId,
      createdAt,
      addressText,
    } = job;

    if (!templatesRepo[fromTemplateId]) {
      return null;
    }
    let daysSinceCreated = getDaysSinceCreated(createdAt);

    return (
      <div className="card disabled is-clipped">
        <header
          style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
          className="card-header is-clipped"
        >
          <p className="card-header-title">{templatesRepo[fromTemplateId].title}</p>
        </header>

        <div className="card-image is-clipped">
          <img className="bdb-cover-img" src={`${templatesRepo[fromTemplateId].imageUrl}`} />
        </div>
        <div
          style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem', position: 'relative' }}
          className="card-content"
        >
          <div className="has-text-dark is-size-7">Requester:</div>
          <UserImageAndRating userDetails={_ownerRef} />
          <div className="content">
            <DisplayLabelValue
              labelText="Start Date:"
              labelValue={
                startingDateAndTime && ` ${moment(startingDateAndTime.date).format('MMMM Do YYYY')}`
              }
            />
            <DisplayLabelValue labelText="Address:" labelValue={addressText} />
            <DisplayLabelValue labelText="Duration:" labelValue={durationOfJob} />
            <DisplayLabelValue labelText="State:" labelValue={state} />

            <div className="has-text-dark is-size-7">Detailed Description</div>
            <span className="is-size-7">
              <TextareaAutosize
                value={detailedDescription}
                className="textarea is-marginless is-paddingless is-size-6"
                style={{
                  resize: 'none',
                  border: 'none',
                  color: '#4a4a4a',
                  fontSize: '1rem',
                }}
                readOnly
              />
            </span>
            <AvgBidDisplayLabelAndValue bidsList={_bidsListRef} />

            <JobStats daysSinceCreated={daysSinceCreated} viewedBy={viewedBy} />
          </div>
        </div>
        <CountDownComponent startingDate={startingDateAndTime.date} />
      </div>
    );
  }
}
