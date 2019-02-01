import React from 'react';
import moment from 'moment';
import TextareaAutosize from 'react-autosize-textarea';

import { templatesRepo } from '../../../constants/bidOrBooTaskRepo';
import {
  DisplayLabelValue,
  CountDownComponent,
  UserImageAndRating,
  getDaysSinceCreated,
  StartDateAndTime,
} from '../../commonComponents';

export default class JobFullDetailsCard extends React.Component {
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
      addressText,
      fromTemplateId,
      reported,
      createdAt,
    } = job;

    let daysSinceCreated = getDaysSinceCreated(createdAt);

    return (
      <div style={{ height: 'auto' }} className="card is-clipped disabled">
        <header
          style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
          className="card-header is-clipped"
        >
          <p className="card-header-title">My {templatesRepo[fromTemplateId].title} Request</p>
        </header>

        <div className="card-image is-clipped">
          <img className="bdb-cover-img" src={`${templatesRepo[fromTemplateId].imageUrl}`} />
        </div>
        <div
          style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem', position: 'relative' }}
          className="card-content"
        >
          <UserImageAndRating userDetails={_ownerRef} />
          <div className="content">
            <StartDateAndTime date={startingDateAndTime} />
            <DisplayLabelValue labelText="Address:" labelValue={addressText} />
            {/* <DisplayLabelValue labelText="State:" labelValue={state} /> */}
            {/*
            <DisplayLabelValue
              labelText="Bids:"
              labelValue={`${_bidsListRef ? _bidsListRef.length : 0}`}
            /> */}
            {/* <DisplayLabelValue
              labelText="Booed:"
              labelValue={`${booedBy ? booedBy.length : 0} times`}
            /> */}
            {/* <DisplayLabelValue
              labelText="Reported:"
              labelValue={`${reported ? reported.length : 0} times`}
            /> */}

            <div className="has-text-grey is-size-7">Detailed Description</div>
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
          </div>
        </div>
        <CountDownComponent startingDate={startingDateAndTime} />
      </div>
    );
  }
}
