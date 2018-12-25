import React from 'react';
import moment from 'moment';
import TextareaAutosize from 'react-autosize-textarea';

import { templatesRepo } from '../../../constants/bidOrBooTaskRepo';
import {
  DisplayLabelValue,
  CountDownComponent,
  UserImageAndRating,
  getDaysSinceCreated,
  MinBidDisplayLabelValue,
} from '../../commonComponents';

export default class JobDetailsForBidder extends React.Component {
  render() {
    const { job } = this.props;
    const {
      startingDateAndTime,
      _bidsListRef,
      _ownerRef,
      state,
      viewedBy,
      booedBy,
      detailedDescription,
      durationOfJob,
      fromTemplateId,
      reported,
      createdAt,
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
            <DisplayLabelValue labelText="Duration:" labelValue={durationOfJob} />
            <DisplayLabelValue labelText="State:" labelValue={state} />
            <MinBidDisplayLabelValue bidsList={_bidsListRef} />

            <DisplayLabelValue
              labelText="Bids:"
              labelValue={`${_bidsListRef ? _bidsListRef.length : 0}`}
            />
            <DisplayLabelValue
              labelText="Booed:"
              labelValue={`${booedBy ? booedBy.length : 0} times`}
            />
            <DisplayLabelValue
              labelText="Reported:"
              labelValue={`${reported ? reported.length : 0} times`}
            />

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
                  fontWeight: '700',
                }}
                readOnly
              />
            </span>

            <nav className="level">
              <div className="level-left">
                <div className="level-item">
                  <span style={{ fontSize: '10px', color: 'grey' }}>
                    {`Posted (${daysSinceCreated} ago)`}
                  </span>
                </div>
              </div>

              <div className="level-right">
                <p className="level-item">
                  <span style={{ fontSize: '10px', color: 'grey' }}>
                    {`Viewed ${viewedBy ? viewedBy.length : 0} times`}
                  </span>
                </p>
              </div>
            </nav>
          </div>
        </div>
        <CountDownComponent startingDate={startingDateAndTime.date} />
      </div>
    );
  }
}
