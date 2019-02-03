import React from 'react';
import AddToCalendar from 'react-add-to-calendar';
import moment from 'moment';

import { templatesRepo } from '../../../constants/bidOrBooTaskRepo';

export const TAB_IDS = {
  awardedJobs: 'Awarded',
  postedJobs: 'Posted',
  pastJobs: 'Past Jobs'
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
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
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
