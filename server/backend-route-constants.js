//any changes to these routes will need to be reflected on the front end
module.exports = {
  API: {
    PUSH: {
      POST: {
        pushNotification: '/api/pushNotification',
        registerPushNotification: '/api/push/register',
      },
      DELETE: {
        unregisterPushNotification: '/api/push/unregister',
      },
    },
    AUTH: {
      GOOGLE: '/api/auth/google',
      GOOGLE_CALLBACK: '/api/auth/google/callback',
      FACEBOOK: '/api/auth/facebook',
      FACEBOOK_CALLBACK: '/api/auth/facebook/callback',
      REGISTER_NEW_USER: '/api/auth/bidorboo/register',
      LOCAL_LOGIN: '/api/auth/bidorboo/login',
      LOGOUT: '/api/auth/logout',
    },
    UTILS: {
      GET: {
        signCloudinaryRequest: '/api/user/paramstosign',
      },
    },
    PAYMENT: {
      POST: {
        payment: '/api/payment',
        personsWebhook: '/api/stripewebhook/persons',
        connectedAccountsWebhook: '/api/stripewebhook/connectedAccounts',
        payoutsWebhook: '/api/stripewebhook/payoutsWebhook',
        checkoutFulfillment: '/api/stripewebhook/checkoutFulfillment',
        chargeSucceededWebhook: '/api/stripewebhook/chargeSucceeded',
      },
      GET: {
        accountLinkForSetupAndVerification: '/api/accountLinkForSetupAndVerification',
        myStripeAccountDetails: '/api/myStripeAccountDetails',
        accountLinkForUpdatingVerification: '/api/accountLinkForUpdatingVerification',
      },
      PUT: {
        setupPaymentDetails: '/api/user/setupPaymentDetails',
      },
    },
    USER: {
      GET: {
        currentUser: '/api/user/currentUser',
        otherUserProfileInfo: '/api/user/otherUserProfileInfo',
        getMyPastRequestedServices: '/api/user/getMyPastRequestedServices',
        getMyPastProvidedServices: '/api/user/getMyPastProvidedServices',
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
        myAwardedRequests: '/api/request/myAwardedRequests',
      },
      POST: {
        requestImage: '/api/request/uploadImages',
        searchRequests: '/api/request/search',
        newRequest: '/api/request/createRequest',
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
      POST: {
        bid: '/api/bids/postABid',
      },
      GET: {
        myPostedBidsSummary: '/api/bids/myPostedBidsSummary',
        myAwardedBids: '/api/bids/myAwardedBids',
        openBidDetails: '/api/bids/openBidDetails',
        awardedBidDetailsForTasker: '/api/bids/awardedBidDetailsForTasker',
        achivedBidDetailsForTasker: '/api/bids/achivedBidDetailsForTasker',
      },
      PUT: {
        updateMyBid: '/api/bids/updateMyBid',
        markBidAsSeen: '/api/bids/markBidAsSeen',
      },
      DELETE: {
        deleteOpenBid: '/api/bids/deleteOpenBid',
        cancelAwardedBid: '/api/bids/cancelAwardedBid',
      },
    },
  },
  CLIENT: {
    ENTRY: 'https://www.bidorboo.ca/BidOrBoo',
    HOME: 'https://www.bidorboo.ca/BidOrBoo',
    USER_ROFILE_FOR_REVIEW: 'https://www.bidorboo.ca/user-profile/:userId',
    dynamicUserProfileForReview: (userId) => `https://www.bidorboo.ca/user-profile/${userId}`,
    dynamicVerification: (field, code) => `https://www.bidorboo.ca/verification/${field}/${code}`,
    MYAGENDA: 'https://www.bidorboo.ca/my-agenda',
    REQUESTER: {
      root: 'https://www.bidorboo.ca/bdb-request',
      createrequest: 'https://www.bidorboo.ca/bdb-request/create-request/:templateId',
      dynamicCreateRequest: (templateId) =>
        `https://www.bidorboo.ca/bdb-request/create-request/${templateId}`,
      myOpenRequests: 'https://www.bidorboo.ca/my-open-requests/:tabId',
      dynamicMyOpenRequests: (tabId) => `https://www.bidorboo.ca/my-open-requests/${tabId}`,
      reviewRequestAndBidsPage: 'https://www.bidorboo.ca/my-request/review-request-details/:requestId',
      dynamicReviewRequestAndBidsPage: (requestId) =>
        `https://www.bidorboo.ca/my-request/review-request-details/${requestId}`,
      selectedAwardedRequestPage: 'https://www.bidorboo.ca/my-request/awarded-request-details/:requestId',
      dynamicSelectedAwardedRequestPage: (requestId) =>
        `https://www.bidorboo.ca/my-request/awarded-request-details/${requestId}`,
    },
    TASKER: {
      root: 'https://www.bidorboo.ca/bdb-offer',
      bidOnRequestPage: 'https://www.bidorboo.ca/bdb-offer/bid-on-request/:requestId',
      getDynamicBidOnRequestPage: (requestId) => `https://www.bidorboo.ca/bdb-offer/bid-on-request/${requestId}`,
      mybids: 'https://www.bidorboo.ca/my-bids',
      reviewMyBidAndTheRequestDetails: 'https://www.bidorboo.ca/review-my-bid-details/:bidId',
      dynamicReviewMyBidAndTheRequestDetails: (bidId) =>
        `https://www.bidorboo.ca/review-my-bid-details/${bidId}`,
      currentAwardedBid: 'https://www.bidorboo.ca/awarded-bid-details/:bidId',
      dynamicCurrentAwardedBid: (bidId) => `https://www.bidorboo.ca/awarded-bid-details/${bidId}`,
    },
    REVIEW: {
      requesterRequestReview: `https://www.bidorboo.ca/bdb-request/review/:requestId`,
      taskerRequestReview: `https://www.bidorboo.ca/bdb-offer/review/:bidId`,
      getRequesterRequestReview: ({ requestId }) => `https://www.bidorboo.ca/bdb-request/review/${requestId}`,
      getTaskerRequestReview: ({ bidId }) => `https://www.bidorboo.ca/bdb-offer/review/${bidId}`,
    },
    MY_PROFILE: {
      myNotifications: '/my-profile/notification-settings',
      basicSettings: 'https://www.bidorboo.ca/my-profile/basic-settings',
      paymentSettings: 'https://www.bidorboo.ca/my-profile/payment-settings',
      pastRequestedServices: 'https://www.bidorboo.ca/my-profile/past-requested-services',
      pastProvidedServices: 'https://www.bidorboo.ca/my-profile/past-provided-services',
    },
  },
};
