import React from 'react';
import TextareaAutosize from 'react-autosize-textarea';

import {
  DisplayLabelValue,
  CountDownComponent,
  UserImageAndRating,
  AvgBidDisplayLabelAndValue,
  StartDateAndTime,
  LocationLabelAndValue,
  JobTitleText,
} from '../../containers/commonComponents';
import { HOUSE_CLEANING_DEF } from './houseCleaningDefinition';

export default class BidOnHouseCleaningJobFullDetails extends React.Component {
  render() {
    const { job } = this.props;
    const {
      startingDateAndTime,
      _bidsListRef,
      _ownerRef,
      state,
      detailedDescription,
      location,
      extras,
    } = job;

    const { TITLE, IMG_URL } = HOUSE_CLEANING_DEF;

    const effortLevel =
      extras && extras.effort ? (
        <DisplayLabelValue labelText="Effort" labelValue={extras.effort} />
      ) : (
        <DisplayLabelValue labelText="Effort" labelValue={'not specified'} />
      );

    return (
      <div style={{ height: 'auto' }} className="card disabled is-clipped">
        <div className="card-image is-clipped">
          <img className="bdb-cover-img" src={IMG_URL} />
        </div>
        <div className="card-content">
          <JobTitleText title={TITLE} />
          <label className="label">Requester:</label>
          <UserImageAndRating userDetails={_ownerRef} />
          <div className="content">
            <StartDateAndTime date={startingDateAndTime} />
            {location && location.coordinates && (
              <LocationLabelAndValue location={location.coordinates} />
            )}
            <DisplayLabelValue labelText="State:" labelValue={state} />
            {effortLevel}
            <div className="field">
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
                <AvgBidDisplayLabelAndValue bidsList={_bidsListRef} />
              </span>
            </div>
          </div>
        </div>
        <CountDownComponent startingDate={startingDateAndTime} />
      </div>
    );
  }
}
