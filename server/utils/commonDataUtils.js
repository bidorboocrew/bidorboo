//handle all user data manipulations
const mongoose = require('mongoose');
const RequestModel = mongoose.model('RequestModel');
const ROUTES = require('../backend-route-constants');

exports.getAwardedRequestOwnerTaskerAndRelevantNotificationDetails = async (requestId) => {
  const awardedRequest = await RequestModel.findById(requestId)
    .populate({
      path: '_awardedBidRef',
      select: {
        _taskerRef: 1,
      },
      populate: {
        path: '_taskerRef',
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

  // to speed this query get rid of virtuals and calculate the request dispaly title on the fly here
  const { _ownerRef, _awardedBidRef, processedPayment } = awardedRequest;
  const { bidAmount } = _awardedBidRef;
  const awardedBidId = _awardedBidRef._id.toString();
  const requestedRequestId = awardedRequest._id.toString();

  const ownerDetails = _ownerRef;
  const awardedTaskerDetails = _awardedBidRef._taskerRef;

  const requesterId = _ownerRef._id.toString();
  const taskerId = awardedTaskerDetails._id.toString();
  const taskerDisplayName = awardedTaskerDetails.displayName;
  const taskerRating = awardedTaskerDetails.rating;

  const requesterDisplayName = ownerDetails.displayName;
  const ownerRating = ownerDetails.rating;

  const requestDisplayName = `${awardedRequest.requestTemplateDisplayTitle} - ${awardedRequest.requestTitle}`;

  const requestLinkForRequester = ROUTES.CLIENT.REQUESTER.dynamicSelectedAwardedRequestPage(requestId);
  const requestLinkForTasker = ROUTES.CLIENT.TASKER.dynamicCurrentAwardedBid(awardedBidId);

  const requesterPushNotSubscription = ownerDetails.pushSubscription;
  const taskerPushNotSubscription = awardedTaskerDetails.pushSubscription;

  const requesterEmailAddress =
    ownerDetails.email && ownerDetails.email.emailAddress ? ownerDetails.email.emailAddress : '';
  const requesterPhoneNumber =
    ownerDetails.phone && ownerDetails.phone.phoneNumber ? ownerDetails.phone.phoneNumber : '';

  const taskerEmailAddress =
    awardedTaskerDetails.email && awardedTaskerDetails.email.emailAddress
      ? awardedTaskerDetails.email.emailAddress
      : '';
  const taskerPhoneNumber =
    awardedTaskerDetails.phone && awardedTaskerDetails.phone.phoneNumber
      ? awardedTaskerDetails.phone.phoneNumber
      : '';

  const allowedToEmailRequester = ownerDetails.notifications && ownerDetails.notifications.email;
  const allowedToEmailTasker =
    awardedTaskerDetails.notifications && awardedTaskerDetails.notifications.email;

  const allowedToTextRequester = ownerDetails.notifications && ownerDetails.notifications.text;
  const allowedToTextTasker =
    awardedTaskerDetails.notifications && awardedTaskerDetails.notifications.text;

  const allowedToPushNotifyRequester =
    ownerDetails.notifications && ownerDetails.notifications.push;
  const allowedToPushNotifyTasker =
    awardedTaskerDetails.notifications && awardedTaskerDetails.notifications.push;

  return {
    requestedRequestId,
    awardedBidId,
    requesterId,
    taskerId,
    requesterDisplayName,
    taskerDisplayName,
    requestDisplayName,
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
