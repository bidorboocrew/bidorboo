//handle all user data manipulations
const mongoose = require('mongoose');
const JobModel = mongoose.model('JobModel');
const ROUTES = require('../backend-route-constants');

exports.getAwardedJobOwnerBidderAndRelevantNotificationDetails = async (jobId) => {
  const awardedJob = await JobModel.findById(jobId)
    .populate({
      path: '_awardedBidRef',
      select: {
        _bidderRef: 1,
      },
      populate: {
        path: '_bidderRef',
        select: {
          _id: 1,
          email: 1,
          phone: 1,
          pushSubscription: 1,
          notifications: 1,
          displayName: 1,
          rating: 1,
        },
      },
    })
    .populate({
      path: '_ownerRef',
      select: {
        _id: 1,
        displayName: 1,
        email: 1,
        phone: 1,
        pushSubscription: 1,
        notifications: 1,
        rating: 1,
      },
    })
    .lean({ virtuals: true })
    .exec();

  // to speed this query get rid of virtuals and calculate the job dispaly title on the fly here
  const { _ownerRef, _awardedBidRef, processedPayment } = awardedJob;
  const { bidAmount } = _awardedBidRef;
  const awardedBidId = _awardedBidRef._id.toString();
  const requestedJobId = awardedJob._id.toString();

  const ownerDetails = _ownerRef;
  const awardedBidderDetails = _awardedBidRef._bidderRef;

  const requesterId = _ownerRef._id.toString();
  const taskerId = awardedBidderDetails._id.toString();
  const taskerDisplayName = awardedBidderDetails.displayName;
  const taskerRating = awardedBidderDetails.rating;

  const requesterDisplayName = ownerDetails.displayName;
  const ownerRating = ownerDetails.rating;

  const jobDisplayName = `${awardedJob.jobTemplateDisplayTitle} - ${awardedJob.jobTitle}`;

  const requestLinkForRequester = ROUTES.CLIENT.PROPOSER.dynamicSelectedAwardedJobPage(jobId);
  const requestLinkForTasker = ROUTES.CLIENT.BIDDER.dynamicCurrentAwardedBid(awardedBidId);

  const requesterPushNotSubscription = ownerDetails.pushSubscription;
  const taskerPushNotSubscription = awardedBidderDetails.pushSubscription;

  const requesterEmailAddress =
    ownerDetails.email && ownerDetails.email.emailAddress ? ownerDetails.email.emailAddress : '';
  const requesterPhoneNumber =
    ownerDetails.phone && ownerDetails.phone.phoneNumber ? ownerDetails.phone.phoneNumber : '';

  const taskerEmailAddress =
    awardedBidderDetails.email && awardedBidderDetails.email.emailAddress
      ? awardedBidderDetails.email.emailAddress
      : '';
  const taskerPhoneNumber =
    awardedBidderDetails.phone && awardedBidderDetails.phone.phoneNumber
      ? awardedBidderDetails.phone.phoneNumber
      : '';

  const allowedToEmailRequester = ownerDetails.notifications && ownerDetails.notifications.email;
  const allowedToEmailTasker =
    awardedBidderDetails.notifications && awardedBidderDetails.notifications.email;

  const allowedToTextRequester = ownerDetails.notifications && ownerDetails.notifications.text;
  const allowedToTextTasker =
    awardedBidderDetails.notifications && awardedBidderDetails.notifications.text;

  const allowedToPushNotifyRequester =
    ownerDetails.notifications && ownerDetails.notifications.push;
  const allowedToPushNotifyTasker =
    awardedBidderDetails.notifications && awardedBidderDetails.notifications.push;

  return {
    requestedJobId,
    awardedBidId,
    requesterId,
    taskerId,
    requesterDisplayName,
    taskerDisplayName,
    jobDisplayName,
    requestLinkForRequester,
    requestLinkForTasker,
    requesterEmailAddress,
    requesterPhoneNumber,
    taskerEmailAddress,
    taskerPhoneNumber,
    allowedToEmailRequester,
    allowedToEmailTasker,
    allowedToTextRequester,
    allowedToTextTasker,
    allowedToPushNotifyRequester,
    allowedToPushNotifyTasker,
    requesterPushNotSubscription,
    taskerPushNotSubscription,
    processedPayment,
    bidAmount,
    ownerRating,
    taskerRating,
  };
};
