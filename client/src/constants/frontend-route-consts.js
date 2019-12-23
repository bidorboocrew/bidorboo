//MAKE SURE THIS IS IN SYNC WITH server\routes\ROUTE_CONSTANTS
export const API = {
  AUTH: {
    GOOGLE: '/api/auth/google',
    GOOGLE_CALLBACK: '/api/auth/google/callback',
    FACEBOOK: '/api/auth/facebook',
    FACEBOOK_CALLBACK: '/api/auth/facebook/callback',
    REGISTER_NEW_USER: '/api/auth/bidorboo/register',
    LOCAL_LOGIN: '/api/auth/bidorboo/login',
    LOGOUT: '/api/auth/logout',
  },
  USER: {
    GET: {
      currentUser: '/api/user/currentUser',
      otherUserProfileInfo: '/api/user/otherUserProfileInfo',
    },
    PUT: {
      userDetails: '/api/user/updateProfileDetails',
      notificationSettings: '/api/user/notificationSettings',
      profilePicture: '/api/user/updateProfileImage',
      updateAppView: '/api/user/updateAppView',
      updateOnboardingDetails: '/api/user/updateOnboardingDetails',
    },
    POST: {
      verifyEmail: '/api/user/verifyEmail',
      verifyPhone: '/api/user/verifyPhone',
      resendVerificationEmail: '/api/user/resendVerificationEmail',
      resendVerificationMsg: '/api/user/resendVerificationMsg',
      loggedOutRequestEmailVerificationCode: '/api/user/requestEmailVerificationCode',
      updateUserPassword: '/api/user/updateUserPassword',
    },
  },
  PAYMENT: {
    POST: {
      payment: '/api/payment',
    },
    GET: {
      accountLinkForSetupAndVerification: '/api/accountLinkForSetupAndVerification',
      accountLinkForUpdatingVerification: '/api/accountLinkForUpdatingVerification',
      payment: '/api/payment',
      myStripeAccountDetails: '/api/myStripeAccountDetails',
    },
    PUT: {
      setupPaymentDetails: '/api/user/setupPaymentDetails',
    },
  },
  REVIEW: {
    PUT: {
      requesterSubmitReview: '/api/review/requesterSubmitReview',
      taskerSubmitReview: '/api/review/taskerSubmitReview',
    },
  },
  REQUEST: {
    GET: {
      myRequestsSummary: '/api/request/myRequestsSummary',
      postedRequestAndBidsForRequester: '/api/postedRequestAndBidsForRequester',
      awardedRequestFullDetailsForRequester: '/api/request/awardedRequestFullDetailsForRequester',
      achivedTaskDetailsForRequester: '/api/request/achivedTaskDetailsForRequester',

      allrequestsToBidOn: '/api/request/allrequestsToBidOn',
      requestToBidOnDetailsForTasker: '/api/request/requestToBidOnDetailsForTasker',
    },
    POST: {
      requestImage: '/api/request/uploadImages',
      createNewRequest: '/api/request/createNewRequest',
      updateSearchThenSearchRequests: '/api/user/updateSearchThenSearchRequests',
    },
    PUT: {
      updateViewedBy: '/api/request/updateViewedBy',
      updateBooedBy: '/api/request/updateBooedBy',
      requesterConfirmsRequestCompleted: '/api/request/requesterConfirmsRequestCompleted',
      taskerConfirmsRequestCompleted: '/api/request/taskerConfirmsRequestCompleted',
      requesterDisputeRequest: '/api/request/requesterDisputeRequest',
      taskerDisputeRequest: '/api/request/taskerDisputeRequest',
      updateRequestState: '/api/request/updateRequestState',
    },
    DELETE: {
      postedRequestAndBidsForRequester: '/api/postedRequestAndBidsForRequester',
    },
  },
  BID: {
    DELETE: {
      deleteOpenBid: '/api/bids/deleteOpenBid',
      cancelAwardedBid: '/api/bids/cancelAwardedBid',
    },
    POST: {
      createNewBid: '/api/bids/createNewBid',
    },
    GET: {
      myPostedBidsSummary: '/api/bids/myPostedBidsSummary',
      openBidDetails: '/api/bids/openBidDetails',
      awardedBidDetailsForTasker: '/api/bids/awardedBidDetailsForTasker',
      achivedBidDetailsForTasker: '/api/bids/achivedBidDetailsForTasker',
    },
    PUT: {
      updateMyBid: '/api/bids/updateMyBid',
      markBidAsSeen: '/api/bids/markBidAsSeen',
    },
  },
};

export const CLIENT = {
  ENTRY: '/BidOrBoo',
  HOME: '/',
  TOS: '/terms-of-service',
  LOGIN_OR_REGISTER: '/login-and-registration',
  ONBOARDING: '/on-boarding',
  RESETPASSWORD: '/reset-password',
  USER_ROFILE_FOR_REVIEW: '/user-profile/:userId',
  dynamicUserProfileForReview: (userId) => `/user-profile/${userId}`,
  dynamicVerification: (field, code) => `/verification/${field}/${code}`,
  REQUESTER: {
    root: '/bdb-request/root',
    createrequest: '/bdb-request/create-request/:templateId',
    dynamicCreateRequest: (templateId) => `/bdb-request/create-request/${templateId}`,
    myRequestsPage: '/my-open-requests',
    reviewRequestAndBidsPage: '/my-request/review-request-details/:requestId',
    dynamicReviewRequestAndBidsPage: (requestId) =>
      `/my-request/review-request-details/${requestId}`,
    selectedAwardedRequestPage: '/my-request/awarded-request-details/:requestId',
    dynamicSelectedAwardedRequestPage: (requestId) =>
      `/my-request/awarded-request-details/${requestId}`,
  },
  TASKER: {
    root: '/bdb-bidder/root',
    bidOnRequestPage: '/bdb-bidder/bid-on-request/:requestId',
    getDynamicBidOnRequestPage: (requestId) => `/bdb-bidder/bid-on-request/${requestId}`,
    mybids: '/bdb-bidder/my-bids',
    reviewMyOpenBidAndTheRequestDetails: 'bdb-bidder/review-my-bid-details/:bidId',
    dynamicReviewMyOpenBidAndTheRequestDetails: (bidId) => `bdb-bidder/review-my-bid-details/${bidId}`,
    awardedBidDetailsPage: '/bdb-bidder/awarded-bid-details/:bidId',
    dynamicReviewMyAwardedBidAndTheRequestDetails: (bidId) => `/bdb-bidder/awarded-bid-details/${bidId}`,
  },
  REVIEW: {
    requesterRequestReview: `/bdb-request/review/:requestId`,
    taskerRequestReview: `/bdb-bidder/review/:bidId`,
    getRequesterRequestReview: ({ requestId }) => `/bdb-request/review/${requestId}`,
    getTaskerRequestReview: ({ bidId }) => `/bdb-bidder/review/${bidId}`,
  },
  MY_PROFILE: {
    myNotifications: '/my-profile/notification-settings',
    basicSettings: '/my-profile/basic-settings',
    paymentSettings: '/my-profile/payment-settings',
  },
};
