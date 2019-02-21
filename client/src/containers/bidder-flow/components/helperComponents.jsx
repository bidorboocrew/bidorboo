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
  // myRequests: 'Mine',
};

export const MYBIDS_TAB_IDS = {
  myBidsTab: 'My Bids',
  pastBids: 'Past Bids',
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

  const selectedTime = `${moment(startingDateAndTime).get('hour')}`;
  let startTime = moment(startingDateAndTime).startOf('day');
  let endTime = moment(startingDateAndTime).endOf('day');

  switch (`${selectedTime}`) {
    case '10':
      startTime = moment(startingDateAndTime).startOf('day');
      endTime = moment(startingDateAndTime).endOf('day');
      break;
    case '8':
      startTime = moment(startingDateAndTime);
      endTime = moment(startingDateAndTime).add(4, 'h');
      break;
    case '12':
      startTime = moment(startingDateAndTime);
      endTime = moment(startingDateAndTime).add(5, 'h');
      break;
    case '17':
      startTime = moment(startingDateAndTime);
      endTime = moment(startingDateAndTime).endOf('day');
      break;
    default:
      startTime = moment(startingDateAndTime).startOf('day');
      endTime = moment(startingDateAndTime).endOf('day');
      break;
  }
  let event = {
    title,
    description,
    location: addressText,
    startTime: `${startTime}`,
    endTime: `${endTime}`,
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
