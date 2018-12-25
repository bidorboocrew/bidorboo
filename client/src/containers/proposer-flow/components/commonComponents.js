import React from 'react';
import AddToCalendar from 'react-add-to-calendar';
import moment from 'moment';
import Countdown from 'react-countdown-now';

import { templatesRepo } from '../../../constants/bidOrBooTaskRepo';

export const AddAwardedJobToCalendar = ({ job }) => {
  if (!job) {
    return null;
  }

  const { startingDateAndTime, _awardedBidRef, addressText, fromTemplateId } = job;
  const { _bidderRef } = _awardedBidRef;

  const { email, phone } = _bidderRef;

  const emailContact = email && email.emailAddress ? `${email.emailAddress}` : '';
  const phoneContactNumber = phone && phone.phoneNumber ? ` or ${phone.phoneNumber}` : '';

  const title = `BidOrBoo: ${templatesRepo[fromTemplateId].title} request`;
  const description = `${
    _bidderRef.displayName
  } is going to help you take care of your request. To get in touch contact them at ${emailContact}${phoneContactNumber}`;

  let event = {
    title,
    description,
    location: addressText,
    startTime: `${startingDateAndTime && moment(startingDateAndTime.date)}`,
    endTime: `${startingDateAndTime && moment(startingDateAndTime.date)}`,
  };
  return (
    <AddToCalendar
      listItems={[{ apple: 'iCal' }, { google: 'Google' }, { outlook: 'Outlook' }]}
      displayItemIcons={false}
      event={event}
      buttonClassClosed="button is-success"
      buttonClassClosed="button is-success"
    />
  );
};

export const DisplayLabelValue = (props) => {
  return (
    <div>
      <div className="has-text-dark is-size-7">{props.labelText}</div>
      <div className="has-text-weight-bold is-size-6 is-primary">{props.labelValue}</div>
    </div>
  );
};

export const CountDownComponent = (props) => {
  const { startingDate, render } = props;
  return (
    <React.Fragment>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          background: 'lightgrey',
        }}
        className="is-size-7 has-text-white has-text-centered"
      >
        <Countdown
          date={startingDate || new Date()}
          intervalDelay={1000}
          renderer={({ days, hours, minutes, seconds, completed }) => {
            return completed ? (
              <Expired />
            ) : (
              <React.Fragment>
                {render({ days, hours, minutes, seconds, completed })}
              </React.Fragment>
            );
          }}
        />
      </div>
    </React.Fragment>
  );
};
const Expired = () => <div className="has-text-danger">Expired!</div>;
