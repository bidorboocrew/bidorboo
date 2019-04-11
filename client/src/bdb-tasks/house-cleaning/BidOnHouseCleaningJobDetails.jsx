import React from 'react';
import TextareaAutosize from 'react-autosize-textarea';

import {
  DisplayLabelValue,
  CountDownComponent,
  UserImageAndRating,
  StartDateAndTime,
} from '../../containers/commonComponents';
import { HOUSE_CLEANING_DEF } from './houseCleaningDefinition';

export default class HouseCleaningRequestDetails extends React.Component {
  render() {
    const { job } = this.props;
    const { startingDateAndTime, _ownerRef, detailedDescription, addressText } = job;
    const { TITLE, IMG_URL } = HOUSE_CLEANING_DEF;

    return (
      <div style={{ height: 'auto' }} className="card is-clipped disabled">
        <header
          style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
          className="card-header is-clipped"
        >
          <p className="card-header-title">My {TITLE} Request</p>
        </header>

        <div className="card-image is-clipped">
          <img className="bdb-cover-img" src={`${IMG_URL}`} />
        </div>
        <div
          style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem', position: 'relative' }}
          className="card-content"
        >
          <UserImageAndRating userDetails={_ownerRef} />
          <div className="content">
            <StartDateAndTime date={startingDateAndTime} />
            <DisplayLabelValue labelText="Address:" labelValue={addressText} />
            <label className="label">Detailed Description</label>
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
