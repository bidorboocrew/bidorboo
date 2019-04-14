import React from 'react';
import TextareaAutosize from 'react-autosize-textarea';

import {
  DisplayLabelValue,
  CountDownComponent,
  UserImageAndRating,
  StartDateAndTime,
  JobTitleText,
} from '../../containers/commonComponents';
import { HOUSE_CLEANING_DEF } from './houseCleaningDefinition';

export default class HouseCleaningRequestDetails extends React.Component {
  render() {
    const { job } = this.props;
    const { startingDateAndTime, _ownerRef, detailedDescription, addressText, extras } = job;
    const { TITLE, IMG_URL } = HOUSE_CLEANING_DEF;

    const effortLevel =
      extras && extras.effort ? (
        <DisplayLabelValue labelText="Effort" labelValue={extras.effort} />
      ) : null;
    return (
      <div style={{ height: 'auto' }} className="card is-clipped disabled">
        <div className="card-image is-clipped">
          <img className="bdb-cover-img" src={`${IMG_URL}`} />
        </div>
        <div className="card-content">
          <div className="content">
            <JobTitleText title={`${TITLE} Request`} />
            <label className="label">Requester</label>
            <UserImageAndRating userDetails={_ownerRef} />
            <div className="content">
              <StartDateAndTime date={startingDateAndTime} />
              <DisplayLabelValue labelText="Address" labelValue={addressText} />
              {effortLevel}
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
        </div>
        <CountDownComponent startingDate={startingDateAndTime} />
      </div>
    );
  }
}
