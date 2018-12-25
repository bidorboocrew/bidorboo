import React from 'react';
import AddToCalendar from 'react-add-to-calendar';
import moment from 'moment';
import Countdown from 'react-countdown-now';

import { templatesRepo } from '../../../constants/bidOrBooTaskRepo';

export const TAB_IDS = {
  openRequests: 'Requests',
  myRequests: 'Mine',
};

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


