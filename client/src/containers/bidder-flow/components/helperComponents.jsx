import React from 'react';
import AddToCalendar from 'react-add-to-calendar';
import moment from 'moment';

import { templatesRepo } from '../../../constants/bidOrBooTaskRepo';

export const BID_STATUS_TO_DISPLAYLABEL = {
  OPEN: 'Pending',
  BOO: 'Boo',
  BOO_SEEN: 'Boo',
  WON: 'Awarded',
  WON_SEEN: 'Awarded',
  CANCEL: 'Cancelled',
  CANCEL_SEEN: 'Cancelled',
};

export const TAB_IDS = {
  openRequests: 'Requests',
  myRequests: 'Mine',
};

export const AddAwardedJobToCalendar = ({ job }) => {
  if (!job) {
    return null;
  }

  const { startingDateAndTime, addressText, fromTemplateId } = job;

  const { email, phone, displayName } = job._ownerRef;

  const emailContact = email && email.emailAddress ? `${email.emailAddress}` : '';
  const phoneContactNumber = phone && phone.phoneNumber ? ` or ${phone.phoneNumber}` : '';

  const title = `BidOrBoo: ${templatesRepo[fromTemplateId].title} request`;
  const description = `You are going to help ${displayName} fulfil a ${title} request. To get in touch contact them at ${emailContact} ${phoneContactNumber}`;

  let event = {
    title,
    description,
    location: addressText,
    startTime: `${startingDateAndTime && moment(startingDateAndTime)}`,
    endTime: `${startingDateAndTime && moment(startingDateAndTime)}`,
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
