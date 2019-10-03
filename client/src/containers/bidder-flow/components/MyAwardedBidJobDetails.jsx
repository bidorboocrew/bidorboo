import React from 'react';
import TextareaAutosize from 'react-autosize-textarea';

import tasksDefinitions from '../../../bdb-tasks/tasksDefinitions';
import {
  DisplayLabelValue,
  CountDownComponent,
  UserImageAndRating,
  StartDateAndTime,
} from '../../commonComponents';

export default class MyAwardedBidJobDetails extends React.Component {
  render() {
    const { job } = this.props;
    const {
      startingDateAndTime,
      _ownerRef,
      state,
      detailedDescription,
      templateId,
      addressText,
    } = job;

    if (!tasksDefinitions[templateId]) {
      return null;
    }

    const jobDefintions = tasksDefinitions[templateId];

    return (
      <div style={{ height: 'auto' }} className="card disabled is-clipped">
        <header
          style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
          className="card-header is-clipped"
        >
          <p className="card-header-title">{jobDefintions.TITLE}</p>
        </header>

        <div className="card-image is-clipped">
          <img className="bdb-cover-img" src={jobDefintions.IMG_URL} />
        </div>
        <div
          style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem', position: 'relative' }}
          className="card-content"
        >
          <label className="label hasSelectedValue">Requester</label>
          <UserImageAndRating userDetails={_ownerRef} />
          <div className="content">
            <StartDateAndTime date={startingDateAndTime} />
            <DisplayLabelValue labelText="Address" labelValue={addressText} />
            <DisplayLabelValue labelText="State" labelValue={state} />

            <label className="label hasSelectedValue">Detailed Description</label>
            <TextareaAutosize
              value={detailedDescription}
              className="textarea is-marginless is-paddingless control"
              style={{
                resize: 'none',
                border: 'none',
              }}
              readOnly
            />
          </div>
        </div>
        <CountDownComponent startingDate={startingDateAndTime} />
      </div>
    );
  }
}
